
;(function($){
    $.fn.header_init = function(){
        let hd=this,$fixbg=hd.find(".bg-wrapper")
        hd.setnavHeight=function($navLevI){
            
            let navheight=0,
            $nav_bg=$navLevI.find('.menu-panel')
            
     
            let lv1h=$navLevI.find(".sub-menu").height(),
            lv2h=$navLevI.find(".nav-lvII.nav-active .nav-third-list").height()
            
            let num= $navLevI.find(".nav-lvII.nav-active .nav-third-list").find(".menu-image").length
            
            if(num>0){
          
               
                $navLevI.find(".nav-lvII.nav-active .nav-third-list").find(".menu-image").load(function(){
                    console.log($navLevI.find(".nav-lvII.nav-active .nav-third-list").find(".menu-image"))
                    num--;
                    if (num > 0) {
                        return;
                    }
                    lv2h=$navLevI.find(".nav-lvII.nav-active .nav-third-list").height()
                     navheight=lv1h+lv2h
                   
                    $nav_bg.css({'height':navheight,'opacity':1});
                    return;
                })
              
            }
         
           lv2h=lv2h?(num==0?lv2h+50:lv2h+30):0
                navheight=lv1h+lv2h
                // navheight=hd.maxheigh(lv1h,lv2h,lv3h,0)
                $nav_bg.css({'height':navheight,'opacity':1});
          
           
        }
        hd.maxheigh=function(lv1h,lv2h,lv3h,paddh){
            lv2h=lv2h?lv2h:0
            lv3h=lv3h?lv3h:0
            let navheight=(lv1h > lv2h ? lv1h : lv2h) > lv3h ? (lv1h > lv2h ? lv1h : lv2h) : lv3h
            navheight+=paddh
            return navheight
        }
        hd.openPanel=function(el){
            // el 一级a
            // $(".nav-lvI").removeClass("nav-active")
            console.log( $(el).parents(".nav-lvI"))
            $(el).parents(".nav-lvI").addClass("nav-active")//lv1 激活
          
            if($(el).parents(".nav-lvI").find(".nav-active").length==0&& $(el).parents(".nav-lvI").find(".menu-panel .nav-lvII").eq(0).hasClass("menu-item-has-children")){ //默认二级第一个展开
                // $(el).parents(".nav-lvI").find(".menu-panel .nav-lvII").eq(0).addClass("nav-active")
            }
            if($(el).parents(".nav-lvI").find(".nav-lvII.nav-active .nav-third-list .nav-active").length==0&& $(el).parents(".nav-lvI").find(".nav-lvII.nav-active .nav-third-list .nav-lvIII").eq(0).hasClass("menu-item-has-children")){ //默认第三级第一个展开
              
                // $(el).parents(".nav-lvI").find(".nav-lvII.nav-active .nav-third-list .nav-lvIII").eq(0).addClass("nav-active")
            }
            hd.setnavHeight($(el).parents(".nav-lvI"))
            
            $fixbg.addClass("bg-fixed")
        }
        hd.closePanel=function(el,callback){
            if(typeof(callback) ==='function'){
                if(hd.find(".nav-lvI").hasClass("nav-active")){
                    hd.find(".nav-lvI.nav-active").find(".menu-panel").css({"height":0,"opacity":0})
                    // setTimeout(function(){
                        hd.find(".nav-active").removeClass("nav-active")
                        // hd.find(".nav-lvI").removeClass("nav-active")
                        callback(el)
                    // },300)
                }
            }else{
                hd.find(".nav-lvI").find(".menu-panel").css({"height":0,"opacity":0})
                // setTimeout(function(){
                    hd.find(".nav-lvI").removeClass("nav-active")
                    
                // },300)
                 $fixbg.removeClass("bg-fixed")
            }
           
           
        }
        $fixbg.on("click mouseenter",function(){
            // console.log($(this))
            // $(this).removeClass("bg-fixed")
            hd.closePanel()
            hd.find(".nav-active").removeClass("nav-active")
        })
        hd.find(".nav-lvI>a>span").on("mouseenter",function(){
            let _this=this
       
            if($(_this).parents(".nav-lvI").hasClass("nav-active")){
                // hd.closePanel(_this)
            }else if(hd.find(".nav-lvI").hasClass("nav-active")){
                
                hd.closePanel(_this,function(){
                    hd.openPanel(_this)
                })
            }else{
                hd.openPanel(_this)
            }
            return false
        })
        hd.find(".nav-lvII>a").on("mouseenter",function(){
            let _this=this
            if($(_this).parents(".nav-lvII").hasClass("nav-active")) return false
            $(_this).parents(".nav-lvII").siblings().removeClass("nav-active")
            if( $(_this).parents(".nav-lvII").hasClass("menu-item-has-children")) $(_this).parents(".nav-lvII").addClass("nav-active")
            // if($(_this).parents(".nav-lvII").find('.nav-lvIII').length>0&&!$(_this).parents(".nav-lvII").find('.nav-lvIII').hasClass("nav-active")&&$(_this).parents(".nav-lvII").find('.nav-lvIII').hasClass("menu-item-has-children")){
            //     $(_this).parents(".nav-lvII").find('.nav-lvIII').eq(0).addClass("nav-active")
            // }
           
            hd.setnavHeight($(_this).parents(".nav-lvI"))
            return false
        })
        // hd.find(".nav-lvIII>a").on("mouseenter",function(){
        //     let _this=this
        //     if($(_this).parents(".nav-lvIII").hasClass("nav-active")) return false
        //     $(_this).parents(".nav-lvIII").siblings().removeClass("nav-active")
          
        //     if( $(_this).parents(".nav-lvIII").hasClass("menu-item-has-children")) $(_this).parents(".nav-lvIII").addClass("nav-active")
        //     hd.setnavHeight($(_this).parents(".nav-lvI"))
        //     return false
        // })
        hd.find(".header-s-i").on("click",function(){
            hd.find(".globalheader-nav").hide()
            // $("#headerserch").show()
            hd.find(".headerserch").addClass("search-active")
            hd.find(".header-s-i img").css("transform","translateX(-120px)")
            
            // setTimeout(function(){
            //     $("#dce-header .fl-search-move").css("right","105px")
            // },100)
        })
        hd.find(".headerserch .fl-search-close").on("click",function(){
            // $("#globalheader-nav").show()
            // $("#headerserch").show()
            hd.find(".headerserch").removeClass("search-active")
            hd.find(".globalheader-nav").show()
            hd.find(".header-s-i img").css("transform","translateX(0)")
        })
        hd.find(".menu-close").on("click",function(){
            
            $fixbg.trigger("click")
        })
    };
    
    $('.header-static').header_init()
    $('.header-fixed').header_init()
    if(window.innerWidth < 750){
        $('#dce-footer .top-container .item-type').click(function(e){
            e.preventDefault()
            if(!$(this).hasClass('active')){
                $(this).addClass('active')
                $(this).closest('.item-wrapper').find('.item-wrap').slideDown()
            }else{
                $(this).removeClass('active')
                $(this).closest('.item-wrapper').find('.item-wrap').slideUp()
            }
        })
    }
    $(".fl-search-input").on("focus",function(){
       $(this).closest("form").addClass("focused")
    })
    $(".fl-search-input").on("blur",function(){
        $(this).closest("form").removeClass("focused")
    })
    var windowTop = $(window).scrollTop();
    $(window).scroll(function() {
        var scrolls = $(this).scrollTop();
        if(scrolls > 120){
            
            if(scrolls <= windowTop) {
                // 向上滚动显示
                console.log('显示 fixed')
               
                $(".header-fixed").addClass("fixed")
                $(".header-fixed").removeClass("up")
                // $('.header-fixed').find(".nav-lvI.nav-active a").trigger("click")
                
            } else {
                // 向下滚动隐藏
               
                $(".header-fixed").removeClass("fixed")
                $(".header-fixed").addClass("up")
            }
        }else{
            // let adminbar=$("body.admin-bar").length>0?32:0
            // console.log("-"+(scrolls-adminbar)+"px;")
            // $("#dce-header").css("top",(adminbar-scrolls)+"px")
            $(".header-fixed").removeClass("up")
            $(".header-fixed").removeClass("fixed")
            if(scrolls==0){
                $('.header-fixed').find(".nav-lvI.nav-active>a").trigger("click")
            }
        }
        windowTop = scrolls;
    });
    openStep = 0;
    if(window.innerWidth <= 750){
        $('#m-open_').click(function(){
            $('#menu-menu2-2').css('overflow','hidden')
            $('.menu-menu2-container, #menu-menu2-2').addClass('open')
        })
        $('#dce-header-m .mb-arrow-wrap .arrow').click(function(){
            switch (openStep){
                case 3: 
                    $('#menu-menu2-2 .nav-lvI .sub-menu').removeClass('slide')
                    $('#menu-menu2-2 .nav-lvII').removeClass('open')
                    $('#menu-menu2-2').animate({ 'scrollTop': 0 })
                    $('#menu-menu2-2 .nav-lvIII>.menu-image-title-after.active').closest('.nav-lvIII').find('.sub-menu').eq(0).slideUp(500)
                    $('#menu-menu2-2 .nav-lvIII>.menu-image-title-after.active').removeClass('active')
                    openStep = 2
                    break;
                case 2: 
                    $('#menu-menu2-2').removeClass('slide')
                    $('#menu-menu2-2 .nav-lvI').removeClass('open')
                    openStep = 1
                    $('#menu-menu2-2').css('overflow','hidden')
                    break;
                case 1: 
                    $('.menu-menu2-container, #menu-menu2-2').removeClass('open')
                    openStep = 0
                    isopen = false
                    break;
                default:
                    $('.menu-menu2-container, #menu-menu2-2').removeClass('open')
                    openStep = 0
                    isopen = false
                    break;
            }
        })
        $('#dce-header-m .mb-arrow-wrap .close').click(function(){
            $('.menu-menu2-container, #menu-menu2-2').removeClass('open')
        })
        var parentTop = 0
        $('#menu-menu2-2>.nav-lvI.menu-item-has-children>.menu-image-title-after').on('click', function(e){
            e.preventDefault()
            e.stopPropagation();
            openStep = 2
            $('#menu-menu2-2').addClass('slide')
            console.log($(this).offset().top)
            $('#menu-menu2-2').css('overflow-y','auto')
            $(this).closest('.nav-lvI').find('.sub-menu').eq(0).css({ 'top': 54 - $(this).offset().top });
            parentTop = 54 - $(this).offset().top
            $(this).closest('.nav-lvI').addClass('open')
        })
        $('#menu-menu2-2 .nav-lvII.menu-item-has-children>.menu-image-title-after').on('click', function(e){
            e.preventDefault()
            e.stopPropagation();
            openStep = 3
            $('#menu-menu2-2').css('overflow-y','auto')
            $(this).closest('.sub-menu').addClass('slide')
            $(this).closest('.nav-lvII').find('.sub-menu').eq(0).css({ 'top': 54 - $(this).offset().top });
            $(this).closest('.nav-lvII').addClass('open')
        })
        $('#menu-menu2-2 .nav-lvIII.menu-item-has-children>.menu-image-title-after').on('click', function(e){
            e.preventDefault()
            e.stopPropagation();
            $('#menu-menu2-2').css('overflow-y','auto')
            if(!$(this).hasClass('active')){
                let self = this;
                $('#menu-menu2-2 .nav-lvIII>.menu-image-title-after.active').closest('.nav-lvIII').find('.sub-menu').eq(0).slideUp(500)
                $('#menu-menu2-2 .nav-lvIII>.menu-image-title-after.active').removeClass('active')
                $(this).addClass('active')
                setTimeout(function(){
                    console.log( $(self).offset().top)
                    console.log($('#menu-menu2-2').scrollTop())
                    var offsetTop = $('#menu-menu2-2').scrollTop() == 0 ? $(self).offset().top - 54 : $(self).offset().top - 54 + $('#menu-menu2-2').scrollTop()
                    $('#menu-menu2-2').animate({ 'scrollTop': offsetTop }, 300,function(){
                        if($(self).hasClass('active')){
                            $(self).closest('.nav-lvIII').find('.sub-menu').eq(0).slideDown()
                        }
                        
                    });
                },500)
                $(self).closest('.nav-lvIII').find('.sub-menu').slideDown()
            }else{
                $(this).removeClass('active')
                $(this).closest('.nav-lvIII').find('.sub-menu').eq(0).slideUp(function(){
                    $('#menu-menu2-2').animate({ 'scrollTop': 0 })
                })
            }
            
        })
    }
})(jQuery);
