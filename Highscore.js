////////////////////////////////////////////////////////////////////////////////
// Highscore class
//
////////////////////////////////////////////////////////////////////////////////
function Highscore()
{
    this.load();
};

Highscore.prototype.scores = [];

Highscore.prototype.tick = function()
{

};

Highscore.prototype.draw = function( _context )
{
};

Highscore.prototype.addTeam = function( _teamName, _players )
{
    this.scores.push( {
        "groupName" : _teamName,
        "finished"  : false,
        "time"      : 0,
        "score"     : 0,
        "players"   : []
    } );
    for ( var idx = 0; idx < players.length; idx++ )
    {
        this.scores[ this.scores.length - 1 ].players.push( {
            "name"      : players[idx].name,
            "jumped"    : 0
        } );
    }

    // Store DNF status
    this.save();
};

Highscore.prototype.start = function()
{
    console.log( "start" );
    this.startTime = new Date();

};

Highscore.prototype.finish = function()
{
    console.log( "finish" );

    this.finishTime = new Date();
    this.finished = true;

    this.scores[ this.scores.length - 1 ].finished = this.finished;
    this.scores[ this.scores.length - 1 ].time = this.finishTime - this.startTime;
    this.scores[ this.scores.length - 1 ].score = parseInt( 1000000000 / this.scores[ this.scores.length - 1 ].time );

    this.save();
};

Highscore.prototype.calculateTime = function( _ms )
{
    var seconds = _ms / 1000;

    var hours = parseInt( seconds / 3600 );
    var minutes = parseInt( (seconds % 3600) / 60 );
    var seconds = seconds % 60 ;

    var time = "";
    if ( hours )
        time += hours + ":";
    if ( hours || minutes )
        if ( minutes < 10 )
            time += "0" + minutes + ":";
        else
            time += minutes + ":";

    if ( hours || minutes || seconds )
    {
        seconds = parseInt(seconds * 1000) / 1000;
        if ( seconds < 10 )
            time += "0" + seconds;
        else
            time += seconds;
    }

    return time;
}

Highscore.prototype.load = function()
{
    if ( !window || !window.localStorage )
    {
        console.log( "saving high score table is disabled" );
        this.scores = [];
        return;
    }

    if ( !window.localStorage.ACKspaceJumpPad )
    {
        console.log( "creating high score table" );
        window.localStorage.ACKspaceJumpPad = "[]";
        this.scores = [];
        return;
    }

    console.log( "fetching high score table" );
    this.scores = JSON.parse( window.localStorage.ACKspaceJumpPad );
    console.log( this.scores );
};

Highscore.prototype.save = function()
{
    if ( !window || !window.localStorage )
    {
        console.log( "sorry, saving high score table is not enabled by your browser" );
        return false;
    }

    console.log( "saving high score table" );
    window.localStorage.ACKspaceJumpPad = JSON.stringify( this.scores );
};

Highscore.prototype.clear = function()
{
    this.scores = [];

    if ( window && window.localStorage && window.localStorage.ACKspaceJumpPad )
    {
        delete window.localStorage.ACKspaceJumpPad;
        return true;
    }

    return false;
};

Highscore.prototype.toString = function()
{
    if ( !this.scores || !this.scores.length )
        return "No highscores";

    //return this.getPersonalScore();
    return this.getOverallScore();
}

Highscore.prototype.getPersonalScore = function()
{
    var score = this.scores[ this.scores.length - 1 ]
    var text = "";
    console.log( score );

    text += "Team ";
    text += score.groupName + "\t";
    text += score.finished ? this.calculateTime( score.time ) : "DNF" + "\n";
    text += "\t" + score.score + "\n\n";

    for ( var idx = 0; idx < score.players.length; idx++ )
    {
        text += score.players[idx].name + "\t";
        text += score.players[idx].jumped + "\n";
    }

    return text;
}

Highscore.prototype.getOverallScore = function()
{
    var sortedDNF = [];
    var sortedScores = [];
    var idx, idy;

    for ( idx = 0; idx < this.scores.length; idx++ )
    {
        //this.scores[idx].finished
        //this.scores[idx].time
        //this.scores[idx].score
        if ( !this.scores[idx].finished )
        {
            sortedDNF.splice( 0, 0, this.scores[idx] );
            continue;
        }

        for ( idy = 0; idy < sortedScores.length; idy++ )
        {

            if ( this.scores[idx].time < sortedScores[idy].time )
                break;

        }
        // Append/inset at (break) position
        sortedScores.splice( idy, 0, this.scores[idx] );
    }

    sortedScores = sortedScores.concat( sortedDNF );



    var text = "Team\tTime\tScore\n";
    for ( var idx = 0; idx < sortedScores.length; idx++ )
    {
        if ( idx < 10 )
            text += "0";
        text += idx + ". ";
        text += sortedScores[idx].groupName;
        text += " ("+sortedScores[idx].players.length+"p)";
        text += "\t";
        if ( sortedScores[idx] === this.scores[ this.scores.length -1 ] )
            text += "-->";

        text += (sortedScores[idx].finished ? this.calculateTime( sortedScores[idx].time ) : "DNF") + "\t";

        if ( sortedScores[idx] === this.scores[ this.scores.length -1 ] )
            text += "-->";
        text += sortedScores[idx].score + "\n";
    }

    return text;
}

// end Highscore class
///////////////////

