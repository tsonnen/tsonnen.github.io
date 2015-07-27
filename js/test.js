function getNotes(){
    var fs          = require('fs');
    var notes       = fs.readdirSync("/home/tobye/jNote/notes");
    var numNotes    = notes.length;

    for (var i = 0; i < numNotes; i++) {
        fs.readFile(notes[i], function(err, data){
            var length  = data.length;
            var read    = 0;
            $('#notes').append("<li id='note'><h1>" + notes[i] + "<h1><p>");
                while ((read != length) && (read < 80)){
                    $('#notes').append(data[read]);
                    read++;
                }
            $('#notes').append("</p></li>");
        });
    };
}