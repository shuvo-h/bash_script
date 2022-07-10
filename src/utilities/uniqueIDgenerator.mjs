export function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// get a unique ID using recursive function
export  async  function getValidID (allExistIDs,minID = 100000,maxID = 1000000){
    const newID = randomInteger(minID,maxID);
    const isExist = allExistIDs.includes(newID);
    
    // if (maxID === allExistIDs.length - 1) {
    if ((maxID >= allExistIDs.length - 1) && ((maxID - 3) <= allExistIDs.length - 1)) {  // show this error if limit reach at (maxLimit - 2)
        console.log(maxID);
        return {idError: true, message:"No user ID available at this moment!"}
    }else if(isExist){
        return getValidID(allExistIDs,minID,maxID);
    }else{
        return {idError: false, newID};
    }
}
