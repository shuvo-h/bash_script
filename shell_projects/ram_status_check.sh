#!/bin/bash

# get free RAM size using this command. test this command in terminal before adding in script
FREE_SPACE_MB=$(free -mt | grep "Total" | awk '{print $4}')        # 'free' give RAM summary, pipe grep take only 'Total' row, then 'awk' take the last column which is sum of total free size
THRESHOLD_SIZE_MB=500          # minimum how much memory need to free else give a alert

if [[ $FREE_SPACE_MB -lt $THRESHOLD_SIZE_MB ]]
then
    echo "You have only $FREE_SPACE_MB MB RAM free. Please release some."
else
    echo "Total free: $FREE_SPACE_MB"
fi

<<MULTI_CMT
    df -H                                       = give all disk status 
    egrep -v "Filesystem|tmpfs|efivarfs"        = remove some specific disk from the output
    grep "sda4"                                 = filter only this list in output
    awk '{print $5}'                            = from the output, only take nth column value
    tr -d %                                     = remove the percentage(%) from the result
MULTI_CMT

HOME_DISK_SPACE_PERCENT=$(df -H | egrep -v "Filesystem|tmpfs|efivarfs" | grep "sda4" | awk '{print $5}' | tr -d %)
MIN_DISK_PERCENT=75
if [[ $HOME_DISK_SPACE_PERCENT -lt $MIN_DISK_PERCENT ]]
then
    echo "You have only $HOME_DISK_SPACE_PERCENT % DISK free in Home. Please release some."
else
    echo "Total free: $HOME_DISK_SPACE_PERCENT %"
fi

 

