const swiperKv = new Swiper(".swiper-kv", {
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    autoplay: {
        delay: 5000,
    },
    loop: true,
});
const swiperProd = new Swiper(".swiper-product", {
    spaceBetween: 24,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        320: {
            slidesPerView: 2,
            slidesPerColumn: 4,
            slidesPerColumnFill: 'row',
            watchOverflow: true,
        },
        1024: {
            slidesPerView: 4,
            slidesPerGroup: 4,
        },
    },
});

var clicked = 0;
$(".toggle-password").click(function (e) {
    e.preventDefault();
    $(this).toggleClass("toggle-password");
      if (clicked == 0) {
        $(this).html('<i class="bi bi-eye-slash"></i>');
        clicked = 1;
      } else {
        $(this).html('<i class="bi bi-eye-fill"></i>');
        clicked = 0;
    }
    var input = $($(this).attr("toggle"));
    if (input.attr("type") == "password") {
       input.attr("type", "text");
    } else {
       input.attr("type", "password");
    }
});

$(document).ready(function() {
    $(".form-select").change(function() {
        $(this).find("option:selected").each(function() {
            var optionValue = $(this).attr("value");
            if (optionValue) {
              $(".select-change").not("." + optionValue).hide();
              $("." + optionValue).show();
            } else {
            //   $(".select-change").hide();
            }
        });
    }).change();
});

$(function () {
    // js:ofi
    objectFitImages('img.of-cover');
    $('img.of-cover').css('opacity',1);

    //banner
    $('.btn-banner-close').click(function() {
        $('#banner').fadeOut();
    })
    
    $('.btn-mobile-menu').on('click', function(event) {
        event.preventDefault();
        $('.btn-mobile-menu').toggleClass('active');
        $("body").toggleClass('scroll-hidden');
    });
    
    $(".input-otp").keyup(function () {
        if (this.value.length == this.maxLength) {
          var $next = $(this).next('.input-otp');
          if ($next.length)
              $(this).next('.input-otp').focus();
          else
              $(this).blur();
        }
    });

});

function changeFavorite(anchor) {
    var icon = anchor.querySelector("i");
    icon.classList.toggle('bi-heart');
    icon.classList.toggle('bi-heart-fill');
}