"use strict"

var scripts = document.getElementsByTagName("script");
var urlBase = scripts[scripts.length-1].src;
urlBase = urlBase.replace('menumobile.js', '');

// dwFilter
(function( $ ){

  // Public methods
  let api = {
    init : function(options) {
      const $btn = $(this);
      // deploy component structure
      let deployment = new Promise(function(resolve, reject){
        methods.deployComponent();
        resolve();
      })
      const $el = $('.menumobile');
      deployment.then(function(){
        methods.getTemplate($el, $btn, options);
      })
    }
  }

  // Private methods
  let methods = {

    deployComponent: function(){
      // convert the div into a dw-filter component
      $('body').append('<div class="menumobile"></div>');
    },

    getTemplate: function($el, $btn, options){
      $.get(urlBase + "templates/menumobile.html", function( result ) {
        let templateContent = result;
        methods.setTemplate($el, $btn, templateContent, options)
      });
    },

    setTemplate : function($el, $btn, templateContent, options){
      let template = _.template(templateContent);
      $el.html( template() );

      if (typeof options !== 'undefined') {
        methods.itemTemplate($el, $btn, options);
        // position by direction
        let direction = options['direction'];
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
        let offset = options['offset'];
        $el.find('content').css({
          top: offset
        });
      } // Todo: falta cuando no trae contenido - $('#sample1').dwSelect()

    },
    itemTemplate: function($el, $btn, options){
      // let data = options.data[0];
      methods.optionTemplate($el, $btn, options);
    },
    optionTemplate: function($el, $btn, options){
      // put items
      let template;
      template = "templates/items.html";
      $.get(urlBase + template, function( result ) {
          let template = _.template(result);
          let data = options['data'];

            data.forEach(function (data, i) {
              let contentHtml;
              let $content = $el.find('content > .items');
              // options
              if(typeof data['items'] !== 'undefined' ){
                // no section
                if(typeof sectionexist !== 'undefinde'){
                  let nameId = data['name'].replace(' ','');
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
          events.startMenu($el, $btn, options); // events
        });
    }

  }


  // Events
  var events = {

    startMenu: function($el, $btn, options){
      events.display($el, $btn, options);
    },

    display: function($el, $btn, options){
      $btn.on({

        touchstart: function(event){
          let direction = options['direction'];
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

        }
      });
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
