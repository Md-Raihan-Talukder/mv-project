echo Menu Names?
read menuNames
for menuName in $menuNames; do
    mkdir $menuName
    logString+="created folder $menuName $(pwd)\n"
    touch $menuName/$menuName.html
    logString+="created file $menuName.html $(pwd)/$menuName\n"
    jsFileName=${menuName//-/.}
    touch $menuName/$jsFileName.ctrl.js
    logString+="created file $jsFileName.ctrl.js $(pwd)/$menuName\n"
done
echo -e "$logString"