#!/bin/bash
isDirectory() {
    [ -d "$1" ]
}
echo -e "\nMenu Names(Use spinal-case naming convention. For multiple menu separate using space)?"
read menuNames
for menuName in $menuNames; do
    if ! isDirectory $menuName; then
        mkdir $menuName
        logString+="created folder $menuName $(pwd)\n"
        touch $menuName/$menuName.html
        logString+="created file $menuName.html $(pwd)/$menuName\n"
        jsFileName=${menuName//-/.}
        touch $menuName/$jsFileName.ctrl.js
        logString+="created file $jsFileName.ctrl.js $(pwd)/$menuName\n"
    else
        logString+="directory $menuName already exist $(pwd)\n"
    fi

done
echo -e "$logString"
