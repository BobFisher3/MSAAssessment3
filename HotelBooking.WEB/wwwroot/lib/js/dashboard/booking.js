var booking = {} || booking;

$(document).ready(function () {
    booking.init();
})

booking.init = function () {
    booking.drawTable();
    booking.validation();
}
booking.validation = function () {
    $.validator.addMethod(
        "regex",
        function (value, element, regexp) {
            return this.optional(element) || regexp.test(value.trim());
        },
        "Please check your input."
    );
    jQuery.validator.addMethod("greaterThan",
        function (value, element, params) {
        if (!/Invalid|NaN/.test(new Date(value))) {
            return new Date(value) > new Date($(params[0]).val());
        }
        return isNaN(value) && isNaN($(params[0]).val()) || (Number(value) > Number($(params[0]).val()));
    },
        'Must be greater than {1}.');
    $('#form').validate({
        rules: {
            Name: {
                required: true,
                regex:  /^[a-zắằẳẵặăấầẩẫậâáàãảạđếềểễệêéèẻẽẹíìỉĩịốồổỗộôớờởỡợơóòõỏọứừửữựưúùủũụýỳỷỹỵA-ZẮẰẲẴẶĂẤẦẨẪẬÂÁÀÃẢẠĐẾỀỂỄỆÊÉÈẺẼẸÍÌỈĨỊỐỒỔỖỘÔỚỜỞỠỢƠÓÒÕỎỌỨỪỬỮỰƯÚÙỦŨỤÝỲỶỸỴ]+(([',. -][a-zắằẳẵặăấầẩẫậâáàãảạđếềểễệêéèẻẽẹíìỉĩịốồổỗộôớờởỡợơóòõỏọứừửữựưúùủũụýỳỷỹỵA-ZẮẰẲẴẶĂẤẦẨẪẬÂÁÀÃẢẠĐẾỀỂỄỆÊÉÈẺẼẸÍÌỈĨỊỐỒỔỖỘÔỚỜỞỠỢƠÓÒÕỎỌỨỪỬỮỰƯÚÙỦŨỤÝỲỶỸỴ ])?[a-zắằẳẵặăấầẩẫậâáàãảạđếềểễệêéèẻẽẹíìỉĩịốồổỗộôớờởỡợơóòõỏọứừửữựưúùủũụýỳỷỹỵA-ZẮẰẲẴẶĂẤẦẨẪẬÂÁÀÃẢẠĐẾỀỂỄỆÊÉÈẺẼẸÍÌỈĨỊỐỒỔỖỘÔỚỜỞỠỢƠÓÒÕỎỌỨỪỬỮỰƯÚÙỦŨỤÝỲỶỸỴ]*)*$/
            },
            PhoneNumber: {
                required: true,
                regex: /^\(?(0|[3|5|7|8|9])+([0-9]{8})$/,

            },
            Email: {
                required: true,
                regex: /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/
            },
            NumberofAdults: {
                required: true,
                min: 1
            },
            NumberofChildren: {
                required: true,
                min: 0
            },
            CheckinDate: "required",
            CheckoutDate: {
                required: true,
                greaterThan: ["#CheckinDate", "CheckinDate"]
            },
            RoomType: {
                required: true
            },
            RoomQuantity: {
                required: true,
                min: 1
            },
            ServiceType: {
                required: true
            },
            ServiceQuantity: {
                required: true,
                min: 1
            }
        },
        messages: {
            Name: {
                required: "Must enter a customer name",
                regex: "Can't use special characters"
            },
            PhoneNumber: {
                required: "Must enter a phone number",
                regex: "Invalid number",
                range: "Must be 10 characters"
            },
            Email: {
                required: "Must enter an email",
                regex: "Invalid email"
            },
            NumberofAdults: {
                required: "You must enter the number of adults",
                min: "Must be atleast 1"
            },
            NumberofChildren: {
                min: "Minimum number is 0"
            },
            CheckinDate: "Must enter a date",
            CheckoutDate: {
                required: "Must enter a date",
                greaterThan: "Invalid date"
            },
            RoomQuantity: {
                required: "Must enter room quantity",
                min: "Must be atleast 1"
            },
            ServiceQuantity: {
                required: "Must enter a value",
                min: "Minimum of 1"
            },
            RoomType: {
                required: "Must enter a room type"
            },
            ServiceType: {
                required: "Must enter a service type"
            }
        }
    })
}
booking.drawTable = function () {
    $('#bookingTable').empty();
    $.ajax({
        beforeSend: function () {
            $('.ajax-loader').css("visibility", "visible");
        },
        url: "/BookingsManager/GetAll",
        method: "GET",
        dataType: "json",
        success: function (data) {
            $.each(data.result, function (i, v) {
                $('#bookingTable').append(
                    `<tr>
                        <td>${v.bookingId}</td>
                        <td>${v.bookingCustomer.name}</td>
                        <td>${dateToDMY(v.createDate)}</td>
                        <td>${dateToDMY(v.checkinDate)}</td>
                        <td>${dateToDMY(v.checkoutDate)}</td>
                        <td>${digitGrouping(v.serviceAmount + v.roomAmount)}</td>
                        <td>
                            <a href="BookingsManager/BookingDetails/${v.bookingId}" class="btn btn-primary"
                                       ><i class="fas fa-edit"></i></a> 
                            <a href="javascripts:;" class="btn btn-danger"
                                        onclick="booking.delete(${v.bookingId}, '${v.bookingCustomer.name}')"><i class="fas fa-trash"></i></a>
                        </td>
                    </tr>`
                );
            });
        },
        complete: function () {
            $('.ajax-loader').css("visibility", "hidden");
        }
    });
}

booking.add = function () {
    booking.reset();
    $('.modal-title').text('Đặt phòng');
    $('#mediumModal').appendTo("body");
    $('#mediumModal').modal('show');
}

booking.reset = function () {
    $('#Name').val('');
    $('#BookingId').val(0);
    $('#CustomerId').val(0);
    $('#NumberofAdults').val('');
    $('#NumberofChildren').val('');
    $('#PhoneNumber').val('');
    $('#Email').val('');
    $('#CouponId').val('');
    $('#CheckinDate').val('');
    $('#CheckoutDate').val('');
}

booking.get = function (id) {
    booking.reset();
    $.ajax({
        beforeSend: function () {
            $('.ajax-loader').css("visibility", "visible");
        },
        url: `/BookingsManager/Get/${id}`,
        method: "GET",
        dataType: "json",
        success: function (data) {
            $('#BookingId').val(data.result.bookingId);
            $('#CheckinDate').val(dateToYMD(data.result.checkinDate));
            $('#CheckoutDate').val(dateToYMD(data.result.checkoutDate));
            $('#Name').val(data.result.bookingCustomer.name).trim();
            $('#PhoneNumber').val(data.result.bookingCustomer.phoneNumber).trim();
            $('#Email').val(data.result.bookingCustomer.email).trim();
            $('#NumberofAdults').val(data.result.numberofAdults);
            $('#NumberofChildren').val(data.result.numberofChildren);
            $('#CouponId').val(data.result.couponId);
            $('#CustomerId').val(data.result.customerId);
        },
        complete: function () {
            $('.ajax-loader').css("visibility", "hidden");
        }
    });

}

booking.save = function () {
    var bookingObj = {};
    var customerObj = {};
    var serviceDetails = [];
    bookingObj.BookingId = parseInt($('#BookingId').val());
    customerObj.Name = $('#Name').val();
    customerObj.PhoneNumber = $('#PhoneNumber').val();
    customerObj.Email = $('#Email').val();
    customerObj.CustomerId = parseInt($('#CustomerId').val());
    bookingObj.NumberofChildren = parseInt($('#NumberofChildren').val());
    bookingObj.NumberofAdults = parseInt($('#NumberofAdults').val());
    bookingObj.CouponId = parseInt($('#CouponId').val());
    bookingObj.CustomerId = parseInt($('#CustomerId').val());
    bookingObj.CheckinDate = new Date($('#CheckinDate').val());
    bookingObj.CheckoutDate = new Date($('#CheckoutDate').val());
    bookingObj.bookingServiceDetails = $('#ServiceDetails').val();
    bookingObj.BookingCustomer = customerObj;
    $.ajax({
        beforeSend: function () {
            $('.ajax-loader').css("visibility", "visible");
        },
        url: `/BookingsManager/Save/`,
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(bookingObj),
        success: function (data) {
            bootbox.alert(data.result.message, function () {
                location.assign(`/Booking`);
            });
            booking.drawTable();
        },
        complete: function () {
            $('.ajax-loader').css("visibility", "hidden");
        }
    });
}

booking.delete = function (id, name) {
    bootbox.confirm({
        title: "Room Reservation",
        message: 'Do you really want to cancer a customers reservation ' + name + '?',
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Yes'
            },
            confirm: {
                label: '<i class="fa fa-check"></i> Cancel'
            }
        },
        callback: function (result) {
            if (result) {
                $.ajax({
                    beforeSend: function () {
                        $('.ajax-loader').css("visibility", "visible");
                    },
                    url: `/BookingsManager/Delete/${id}`,
                    method: "GET",
                    dataType: "json",
                    success: function (data) {
                        bootbox.alert(data.result.message);
                        $.ajax({
                            url: `/BookingServiceDetails/DeleteByBookingId/${id}`,
                            method: "GET",
                            dataType: "json"
                        });
                        $.ajax({
                            url: `/BookingRoomDetails/DeleteByBookingId/${id}`,
                            method: "GET",
                            dataType: "json"
                        });
                        booking.drawTable();
                    },
                    complete: function () {
                        $('.ajax-loader').css("visibility", "hidden");
                    }
                });
            }
        }
    });
}

dateToDMY = function (date) {
    date = new Date(date);
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '-' + (m <= 9 ? '0' + m : m) + '-' + y;
}

dateToYMD = function (date) {
    date = new Date(date);
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}
digitGrouping = function (price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}