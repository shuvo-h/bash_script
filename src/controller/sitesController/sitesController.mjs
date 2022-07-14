import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fetch,{Headers} from 'node-fetch';
import { SitesModel } from "../../models/SitesModel/SitesModel.mjs";

export async function addNewSiteCtl(req,res,next) {
    const user_id = req.decodedUser?.user_id;
    // console.log(req.body);
    // process.exit()
    // make hash the password
    // generate JWT token of the password instead of hash 
    const tokenObject = {username: req.body.username, password: req.body.password, site_id: req.body.site_id, domain_url: req.body.domain_url};
    const siteAccessToken = jwt.sign(tokenObject,process.env.JWT_SITE_TOKEN_SECRET_NEVER_CHANGE,{expiresIn:process.env.JWT_EXPIRY})
    console.log(user_id);
    // decrept the site information
    // const decodedSiteInfo = jwt.verify(accessToken,process.env.JWT_SITE_TOKEN_SECRET_NEVER_CHANGE);
    if (req.body.site_id && siteAccessToken && user_id) {
        try {
            // process the new site info whrough mongoose shema
            const newSite = new SitesModel({user_id,site_id:req.body.site_id,title: req.body.title,token:siteAccessToken});
            const newSiteAddRes = await newSite.save();
            res.json(newSiteAddRes)
            
        } catch (err) {
            res.status(500).json({error:{common:{msg: err.message}}})
        }
    }else{
        res.json({error:{common:{msg: "Something went wrong!"}}})
    }
}

export async function getUsersSites(req,res,next) {
    if (req.decodedUser?.user_id) {
        try {
            const siteList = await SitesModel.find({user_id: req.decodedUser.user_id},{_id:0,title:1,site_id:1})
            res.json(siteList)
        } catch (err) {
            res.status(500).json({error:{common:{msg: err.message}}})
        }
    }else{
        res.json({error:{common:{msg: "Something went wrong!"}}})
    }
}


export async function getWordsInfoCtl(req,res,next) {
    const username = req.decodedSiteAccess?.username;
    const password = req.decodedSiteAccess?.password;
    const endDate = req.body?.endDate;
    const startDate = req.body?.startDate;
    const domain_url = req.decodedSiteAccess?.domain_url; // add this site url during adding each site
    if (username && password && (startDate < endDate) && domain_url) {
        const dateAfter = (new Date(startDate)).toISOString().slice(0,19);
        const dateBefore = (new Date(endDate)).toISOString().slice(0,19)
        try {
            // organize headers
            // const Headers = fetch.Headers;
            const headers = new Headers()
            headers.set("Content-Type","application/json")
            headers.set("Authorization","Basic " + Buffer.from(`${username}:${password}`).toString("base64"))
            
            // loop to get data for all pages
            const allBlogs = [];
            let isMorePage = true;
            let pageCount = 1;

            console.log(req.decodedSiteAccess,"Entered t o word wold");
            while (isMorePage) {
                const blogData = await new Promise(async function (resolve,reject){
                    try {
                        const blogs = await fetch(`${domain_url}/wp-json/wp/v2/posts?_fields[]=title&_fields[]=date&_fields[]=content&_fields[]&after=${dateAfter}&before=${dateBefore}&page=${pageCount}&per_page=100`).then(res=>res.json())
                    //    console.log(allBlogs.length);
                        if (!blogs.length) {
                          isMorePage = false;
                        }
                        resolve(blogs)
                    } catch (error) {
                        resolve(error)
                    }
                })
                console.log(blogData.length, "page = ", pageCount);
                if (blogData.length) {
                  allBlogs.push(blogData)
                }
                pageCount++;
            }
            // make flat of the blog
            const flattenBlogs = allBlogs.flat();
            // loop and count the total words of each blog post
            const blogs = [];
            let blog_i = 0;
            const blogsInfo = flattenBlogs.map(blog =>{
                // const txtHtml = response[0].content.rendered
                const blogTEXT = flattenBlogs[blog_i].content?.rendered;
                const words = blogTEXT.replace(/<(?:.|\s)*?>/g, " ").replace(/\n/g," ").split(" ").filter(word=>word.length>0).length;
                blogs.push({words, title:blog.title.rendered, date:blog.date});
                // increase the blog counter
                blog_i++;
            })
            
            // res.json(blogs)
            res.json(blogs)
            
        } catch (err) {
            res.status(500).json({error:{common:{msg: err.message}}})
        }
        
    }else{
        res.json({error:{common:{msg: "Site is not accessiable!"}}})
    }
}


