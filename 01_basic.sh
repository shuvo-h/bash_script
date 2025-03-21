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

# key-value pair (like object/dictionary). declare the vaiable first to use as object
declare -A userObj
userObj=([name]=Arnil [school]=primary [roll]=25)
echo "user object: name = ${userObj[name]} | school = ${userObj[school]} | roll = ${userObj[roll]}"



#string operations
myString="I go to school!"
echo "String length    ====> ${#myString}"
echo "String uppercase ====> ${myString^^}"
echo "String lowercase ====> ${myString,,}"
echo "String replace   ====> ${myString/school/replaced_school_to_collage}"
echo "String slice     ====> ${myString:5:9}"




# user interaction 
# start from 59:00 minutes of the turorial






#store output of a command or take user inpur
HOSTNAME=$(hostname)
echo "what is your name?"

echo "_ is useing under m/c $HOSTNAME"



