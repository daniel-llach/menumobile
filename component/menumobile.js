
var scripts = document.getElementsByTagName("script");
var urlBase = scripts[scripts.length-1].src;
urlBase = urlBase.replace('menumobile.js', '');

// dwFilter
(function( $ ){
  "use strict"

  // Public methods
  var api = {
    init : function(options) {
      var btnId = $(this).attr('id');
      // deploy component structure
      var deployment = new Promise(function(resolve, reject){
        methods.deployComponent();
        resolve();
      })
      var $el = $('.menumobile');
      deployment.then(function(){
        methods.getTemplate($el, btnId, options);
      })
    }
  }

  // Private methods
  var methods = {

    deployComponent: function(){
      // convert the div into a dw-filter component
      $('body').append('<div class="menumobile"></div>');
    },

    getTemplate: function($el, btnId, options){
      $.get(urlBase + "templates/menumobile.html", function( result ) {
        var templateContent = result;
        methods.setTemplate($el, btnId, templateContent, options)
      });
    },

    setTemplate : function($el, btnId, templateContent, options){
      var template = _.template(templateContent);
      $el.html( template() );

      if (typeof options !== 'undefined') {
        methods.itemTemplate($el, btnId, options);
        // position by direction
        var direction = options['direction'];
        switch (direction) {
          case 'left':
            $el.css({
              top: 0,
              left: '100%'
            });
            break;
          case 'right':
            $el.css({
              top: 0,
              right: '100%'
            });
            break;
          case 'up':
            $el.css({
              top: '100%',
              left: 0
            });
            break;
          case 'down':
            $el.css({
              bottom: '100%',
              left: 0
            });
            break;
          default:

        }
        var offset = options['offset'];
        if ( $(document).width() < 768 ){
          $el.find('content').css({
            top: (offset + 78) + 'px'
          });
        }else{
          $el.find('content').css({
            top: offset + 'px'
          });

        }
      } // Todo: falta cuando no trae contenido - $('#sample1').dwSelect()

    },
    itemTemplate: function($el, btnId, options){
      // var data = options.data[0];
      methods.optionTemplate($el, btnId, options);
    },
    optionTemplate: function($el, btnId, options){
      // put items
      var template;
      template = "templates/items.html";
      $.get(urlBase + template, function( result ) {
          var template = _.template(result);
          var data = options['data'];

            data.forEach(function (data, i) {
              var contentHtml;
              var $content = $el.find('content > .items');
              // options
              if(typeof data['items'] !== 'undefined' ){
                // no section
                if(typeof sectionexist !== 'undefinde'){
                  var nameId = data['name'].replace(' ','');
                  // have items
                  $content.append('<span class="section" id="' + nameId +  '"><h3>' + data['name'] + '</h3><div class="sectionItems"></div></span>');
                  data['items'].forEach(function(item, i){
                    contentHtml = template({
                      name: item['name'],
                      link: item['link']
                    });
                    $content.find('#' + nameId + ' .sectionItems').append(contentHtml);

                  })
                }
              }else{
                // no section, no items
                contentHtml = template({
                  name: data['name'],
                  link: data['link']
                });
                // paint it
                $content.append(contentHtml);
              }


            });


          // methods.order($el); // order
          events.startMenu($el, btnId, options); // events
        });
    }

  }


  // Events
  var events = {

    startMenu: function($el, btnId, options){
      events.display($el, btnId, options);
    },

    display: function($el, btnId, options){
      interact('#' + btnId)
      .on('tap', function (event) {
        var direction = options['direction'];
        switch (direction) {
          case 'left':
          $el.toggleClass('displayLeft');
          break;
          case 'right':
          $el.toggleClass('displayRight');
          break;
          case 'up':
          $el.toggleClass('displayUp');
          break;
          case 'down':
          $el.toggleClass('displayDown');
          break;
          default:

        }
        event.preventDefault();
      })



    }

  };


  // jquery component stuff
  $.fn.menumobile = function(methodOrOptions) {
      if ( api[methodOrOptions] ) {
          return api[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ))
      } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
          // Default to "init"
          return api.init.apply( this, arguments )
      } else {
          $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.menumobile' )
      }
  };


})( jQuery )
