css(".tinyCss",{
    "width":"50%",
    "background-color":"red"
});

tag("body",{"align":"center"},function(){
    return html("div",{
        "innerHTML":"wow test!"
    }).next(tag("input",{
        "id":"username",
        "type":"text",
        "class":"someCss",
        "placeholder":"username",
    }));
});


