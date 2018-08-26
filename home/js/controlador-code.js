function modalRegistro(){
	$("#modalRegistro2").modal("show");
}

$("#salir").click(function(){
	$.ajax({
		url:"/salir",
		success:function(respuesta){
			window.location.href ="login.html";
		}
	});
});

$("#btn-crear-carpeta").click(function(){
	//alert("Enviar mensaje: " + $("#txta-mensaje").val());
	var parametros = "codigoUsuario="+$("#usuario-logeado").val() +"&" +
                     "nombrecarpeta="+$("#nombrecarpeta").val();
	$.ajax({
		url:"/crear-carpeta",
		method:"POST",
		data:parametros,
		dataType:"json",
		success:function(respuesta){
            window.location.href ="homecode.html";
			console.log(respuesta);
		}
	});
});

$("#guardar-archivo").click(function(){
	//alert("Enviar mensaje: " + $("#txta-mensaje").val());
	var parametros = "codigoUsuario="+$("#usuario-logeado").val() +"&" +
					 "nombre="+$("#nombre-archivo").val() + "&"+
                     "contenido="+$("#Textarea1").val();
	$.ajax({
		url:"/guardar-archivo",
		method:"POST",
		data:parametros,
		dataType:"json",
		success:function(respuesta){
            window.location.href ="homecode.html";
			console.log(respuesta);
		}
	});
});

$(document).ready(function(){
	//Esta funcion se ejecuta cuando la página esta lista
	$.ajax({
		url:"/obtener-usuario",
		dataType:"json",
		success:function(respuesta){
			console.log(respuesta);{
                $("#usuario-logeado").val(respuesta.CODIGO_USUARIO);
                
				
			}
		}
	});

});