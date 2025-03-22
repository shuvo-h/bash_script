#!/bin/bash

echo "I am runnning from bash"

: <<'COMMENT_TAG'
This is a multi-line comment.
It spans multiple lines.
Everything inside this block is ignored by Bash.
COMMENT_TAG

# constant variable
age=10
readonly EMAIL="ab@example.com"   # readonly variable, dont allow to update the value
echo "my age is $age and my email is $EMAIL"


echo -e "\n\n ******* Array *************** \n"
# Array
myArray=(5 myEquipment "my pen red")
echo "1st elm = ${myArray[0]}"
echo "2nd elm = ${myArray[1]}"
echo "3rd elm = ${myArray[2]}"
echo "length of array = ${#myArray[*]}"
echo "array idx to end = ${myArray[*]:1}"
echo "array range slice = ${myArray[*]:1:3}"

# push/append into array
myArray+=(newElement 37 'and more')
echo "After push new element into array = ${myArray[*]}"


echo -e "\n\n ******* Array of Object *************** \n"
# key-value pair (like object/dictionary). declare the vaiable first to use as object
declare -A userObj
userObj=([name]=Arnil [school]=primary [roll]=25)
echo "user object: name = ${userObj[name]} | school = ${userObj[school]} | roll = ${userObj[roll]}"


echo -e "\n\n ******* String operations *************** \n"
#string operations
myString="I go to school!"
echo "String length    ====> ${#myString}"
echo "String uppercase ====> ${myString^^}"
echo "String lowercase ====> ${myString,,}"
echo "String replace   ====> ${myString/school/replaced_school_to_collage}"
echo "String slice     ====> ${myString:5:9}"



echo -e "\n\n ******* Take user input *************** \n"
# user interaction 			// read "question?" <variableName> 
# read -p "What is your username? - " usernameVar
# echo "User's input is = ${usernameVar}"



# Arithmatic Operations
price=10
quantity=3
tax=01
let totalPrice=$price*$quantity-$tax
echo "Variable store way, price X quantity = ${totalPrice}"
echo "Inline calculation, Price X Quantity = $(($price*$quantity-$tax))"



# conditions
echo -e "\n\n ******* User Input and if-else Condition *************** \n"
read -p "What is your marks in Mathametics? " marks

# if-else condition
if [[ $marks -gt 40 ]] && [[ $marks -lt 80 ]]
then
	echo "You are pass"
elif [[ $marks == 33 ]]
then
	echo "you are exactly passed"
else 
	echo "YOu are Fail"
fi


# list of comparison operator
# -eq/==	==
# -ne/!=	!= 	
# -gt 		 >
# -lt		 <
# -ge		>=
# -le 		<=

# logical operator
# && 		AND
# || 		OR

echo -e "\n\n ******* Switch Case *************** \n"
# Switch case 
echo "Which color do you like?"
echo "a) I want to know date?"
echo "b) Give me dir list?"
echo "c) what is current location?"

read myChoice
case $myChoice in 
	a) 
		echo "Today's date is = $(date)"
		echo "The weather is good today";;
	b) ls;;
	c) pwd;;
	*) echo "Please choose a valid option" 
esac






# loop 
echo -e "\n\n ******* number LOOP *************** \n"
# loop syntax 1
for i in 10 20 30 40 50
do 
	echo "Regular loop number = $i"
done

echo -e "\n\n ******* String LOOP *************** \n"
# loop syntax 2
for i in David is a good boy
do
	echo "string loop $i"
done

echo -e "\n\n ******* Range LOOP *************** \n"
# loop syntax 3: range of value
for i in {15..22}
do
	echo "Range loop number $i"
done

echo -e "\n\n ******* File read by loop  *************** \n"
# read file with for loop
myFile="/shuvodc/bash_script/nameList.txt"
for i in $(cat $myFile)
do
	echo "Name in file = $i";
done


echo -e "\n\n ******* Array LOOP *************** \n"
# do loop in an array
myArray=(David 18 34 6 true 63 extra)
myArrayLength=${#myArray[*]}
for ((i=0;i<$myArrayLength;i++)) 				# for arimetic operators, we need double first bracket in for loop
do
	if [[ $i -eq 3 ]]
	then
		echo "____SKIP____ in $i index"
		continue
	fi
	if [[ $i -eq 5 ]]
	then
		echo "____BREAK___ loop after $i index"
		break
	fi
	echo "current element is = ${myArray[$i]}"
done


echo -e "\n\n ******* While LOOP *************** \n"
number=10
count=0
while [[ $count -le $number ]]
do
	echo "While loop number = $count"
	let count++								# increase the count by 1 using 'let' keyword 
done

echo -e "\n\n ******* Until LOOP *************** \n"
# until loop
age=0
until [[ $age -eq 3 ]]
do
	echo "Until loop number = $age"
	let age++
	sleep 1s 							# in every loop, wait for 2s
done


echo -e "\n\n ******* function *************** \n"
# function 
function doSum {
	local arg1=$1					# $1,$2 is the position to pass the argument when call the function
	local arg2=$2
	let result=$arg1+$arg2 
	echo "------------"
	echo "sum of $arg1+$arg2 = $result"
	echo "------------"
}

doSum 4 8		# do sum on 4+8
doSum 36 65		# do sum on 36+65



echo -e "\n\n ******* Script Arguments *************** \n"
# access arguments which were passed during run the *.sh script
# /path/myScript.sh arg1 arg2.....
echo "Number of arg pass when script run = $#"  		# '$#' give how many args were given when runn script
echo "Show all args pass when script run = $@"			# '$@' to get all args passed when run script
echo "args pass when script run: 1st arg = $1"
echo "args pass when script run: 2nd arg = $2"
echo "args pass when script run: 3rd arg = $3"
for arg in $@
do 
	echo "In loop: Arg when run script is $arg"
done

# learn to use 'shift' to take rest of the argument when pass args in script run


echo -e "\n\n ******* Some Cmmands *************** \n"
echo "wait for 2 seconds"
sleep 2s 			# wait for 2 seconds
#exit 1				# stop the script here, next code will not execute
echo "exist status is = $?"   # '$?' give us the exist status code, eg 1, 0.. Here 0 means no error. else any other number is script unsuccessfull error



echo -e "\n\n ******* Exist Script *************** \n"
read -p "Website you want to ping? " website
ping -c 1 $website
exit_status_code=$?								# '$?' give the exist status code of current operaion
if [[ $exit_status_code -eq 0 ]]
then
	echo "Network successfully connected to $website"
else
	echo "Failed to connect to $website"
fi






echo -e "\n\n ******* Check File or Dir exist *************** \n"
FILEPATH="/home/user/path/example.txt"
if [[ ! -f $FILEPATH ]]
then 
	echo "Wrong filepath: $FILEPATH"
else
	echo "File path is correct: $FILEPATH"
fi

DIRPATH="/home/user/path/mypath/"
if [[ ! -d $DIRPATH ]]
then 
	echo "Wrong directory path: $DIRPATH"
else
	echo "Directory path is correct: $DIRPATH"
fi




echo -e "\n\n ******* bash variables *************** \n"
echo "It is a random variable: $RANDOM"
echo "It is loggedin user id variable: $UID"



echo -e "\n\n ******* Redirection in script *************** \n"
echo "Writing all files name of this directory in a new file"
ls -al > myFileList.txt 	# ' > '  means write the output to the file
date >> myFileList.txt		# ' >> ' means append the output to existing file
pwd >> myFileList.txt
hostname >> myFileList.txt




echo -e "\n\n ******* nohup : Running script in background *************** \n"
# nohup scriptName.sh > outputFile.log 2>&1 & 			# it will run a script in  the background without hangup in termninal, And keep the log in the given log file
# ps aux | grep scriptName.sh							# It will show if the script is running or not
#pkill -f scriptName.sh									# It will stop the script which was running in background



echo -e "\n\n ******* crontab : Running script in background  with scheduler *************** \n"
## only one time if a script need to run
# at 12:09PM
# 	<your_command>
# Ctrl + D

## check the list of scheduler
# >> atq 						// to check the schedule job
# >> atrm <atq_id>				// to remove a schedule job by id

# Repeated Scheduling: Periodically need to run a script
# >> apt install cron -y				// install crontab
# >> sudo systemctl enable --now cron	// enable the corntab
# >> systemctl status cron 				// ceck corntab status is running
# >> crontab -l							// check existing jobs list
# >> crontab -e 						// add a new job in crontab by file edit
# * * * * * <command_1> && <command_2> && <...more>   // add this line in the crontab edit file. the five '*' is the scheduler time when this commands will run 
# example:
	# periodically at this time run command: first go the the path and then run that script
 	# * 16 23 * * cd /shuvodc/bash_script/ && ./01_basic.sh





#store output of a command or take user inpur
HOSTNAME=$(hostname)
echo "what is your name?"

echo "_ is useing under m/c $HOSTNAME"



