////////////////////////////////////////////////////////////////////////////////
// InfoPane class
//
////////////////////////////////////////////////////////////////////////////////
function InfoPane()
{

};

InfoPane.prototype.info = "";
InfoPane.prototype.opacity = 0;
InfoPane.prototype.fadeStep = 0;
InfoPane.prototype.stepSize = 0.05;
InfoPane.prototype.autoHide = 0;

InfoPane.prototype.tick = function()
{
    if ( this.opacity > 1 )
        this.opacity = 1;
    else if ( this.opacity < 0 )
        this.opacity = 0;

    if ( !this.fadeStep)
        return;

    if ( this.fadeStep > 0 && this.opacity < 1 )
        this.opacity += this.fadeStep;
    else if ( this.fadeStep < 0 && this.opacity > 0 )
        this.opacity += this.fadeStep;

    if ( this.opacity >= 1 && this.fadeStep > 0 )
    {
        this.fadeStep = 0;
        if ( this.autoHide === true )
            this.autoHide = 3000;
        if ( this.autoHide )
        {
            var that = this;
            window.setTimeout( function()
            {
                that.hideInfo();
            }, this.autoHide );
        }
    }

    if ( this.opacity <= 0 && this.fadeStep < 0 )
        this.fadeStep = 0;
};

InfoPane.prototype.draw = function( _context )
{

    if ( this.opacity <= 0 )
        return;

    _context.strokeStyle = "rgba( 50, 50, 50, " + (0.5* this.opacity) + ")";
    _context.fillStyle = "rgba( 255,255, 128, " + (0.5* this.opacity) + ")";
    _context.lineWidth = 15;

    var arrInfo = this.info.split( "\n" );

    var sw = document.getElementById('canvas').width;
    var sh = document.getElementById('canvas').height;

    var wPercentage = 0.6;
    var hPercentage;
    if ( arrInfo.length > 1 )
        hPercentage = 0.9;
    else
        hPercentage = 0.4;


    var w = sw * wPercentage;
    var h = sh * hPercentage;

        

    var x = sw * (1 - wPercentage) / 2 + 10;
    var y = sh * (1 - hPercentage) / 2 + 10;

    var metrics = _context.measureText('W');
    var th = metrics.width * 1.6;
    var tw = w / 2.1;

    _context.shadowBlur=20;
    _context.shadowColor="white";

    this.roundRect( _context, (sw - w ) / 2, (sh - h ) / 2, w, h, true, true );

    _context.lineWidth = 1;
    _context.strokeStyle = "rgba( 255, 255, 255, " + (this.opacity) + " )";
    _context.fillStyle = "rgba( 0, 0, 0, " + (this.opacity) + " )";

    _context.font = "bold 22px sans-serif";
    _context.textBaseline = "top";

    for (var idx = 0; idx < arrInfo.length; idx++ )
    {
        _context.textAlign = "left";
        var arrInfoLine = arrInfo[idx].split( "\t" );
        x = sw * 0.2 + 10;
        for (var idy = 0; idy < arrInfoLine.length; idy++ )
        {
            if ( idy )
                _context.textAlign = "right";

            _context.fillText( arrInfoLine[idy], x, y );
            x += tw;
        }
        y += th;
    }

};

InfoPane.prototype.roundRect = function( ctx, x, y, width, height, radius, fill, stroke )
{
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill();
  }        
}

InfoPane.prototype.setInfo = function( _info, _autoHide )
{
    // Parse info on newlines and tabs
    this.info = _info;


    this.fadeStep = this.stepSize;

    if ( _autoHide )
        this.autoHide = _autoHide;
};

InfoPane.prototype.hideInfo = function( )
{
    this.fadeStep = -this.stepSize;
    delete this.autoHide;
};

InfoPane.prototype.isBusy = function( )
{
    // Currently fading
    if ( this.fadeStep )
        return true;

    // Has auto hide set
    if ( this.autoHide )
        return true;
}


// end InfoPane class
///////////////////

