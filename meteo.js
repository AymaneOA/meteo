if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
      .then(response => response.json())
      .then(data => {
        const city = data.address.city;
        document.getElementById("ville").innerHTML=("Ville: " + city);
      })
      .catch(error => console.error(error));
      
    var xhr = new XMLHttpRequest();
    xhr.open("GET",' https://api.open-meteo.com/v1/forecast?latitude='+latitude+'&longitude='+longitude+ '&hourly=temperature_2m,relativehumidity_2m,rain&daily=temperature_2m_max,temperature_2m_min,rain_sum&timezone=auto');
   
    xhr.onload = function () {
      var tab = JSON.parse(xhr.response);
      console.log(tab);
      var a = new Date();

      document.getElementById("temp").innerHTML = tab.hourly.temperature_2m[a.getHours()] + "°";

      var ma = tab.hourly.temperature_2m[0];
      for (var i = 0; i <= 24; i++) {
        if (tab.hourly.temperature_2m[i] > ma) {
          ma = tab.hourly.temperature_2m[i];
        }

      }

      document.getElementById("high-low").innerHTML = ma + "°" + "/";

      var ra = tab.hourly.temperature_2m[0];
      for (var i = 0; i <= 24; i++) {
        if (tab.hourly.temperature_2m[i] < ra) {
          ra = tab.hourly.temperature_2m[i];
        }

      }

      document.getElementById("high-loww").innerHTML = ra + "°";

      var j = 1;
      for (var i = 0; i < 24; i += 6) {
        document.getElementById("heure_" + j).innerHTML = tab.hourly.temperature_2m[i] + "°" + "<br>";;
        j++;
      }


      var p = 1;
      for (var i = 0; i < 24; i += 6) {
        document.getElementById("rain_" + p).innerHTML = tab.hourly.rain[i] + "(mm)" + "<br>";;
        p++;
      }



      var date = new Date();
      const joursSemaine = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

      const jourActuel = new Date().getDay();
      var p = 1;
      for (let i = 0; i < 7; i++, p++) {

        const indexJour = (jourActuel + i) % joursSemaine.length;
        console.log(joursSemaine[indexJour]);
        if (p == 1) {
          document.getElementById("jour" + p).innerHTML = "ce_jour";
          continue;
        }
        document.getElementById("jour" + p).innerHTML = joursSemaine[indexJour];
      }


      fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`)
        .then(response => response.json())
        .then(data => {
          const sunrise = new Date(data.results.sunrise);
          const sunset = new Date(data.results.sunset);

         
          document.getElementById("sunrise").innerHTML = ("Sunrise: " + sunrise.toLocaleTimeString() + "°");
          document.getElementById("sunset").innerHTML = ("Sunset: " + sunset.toLocaleTimeString());
        })
        .catch(error => console.error(error));

      g = 0;
      for ( i =0; i <= 6; i++) {
        document.getElementById("r_" + g + "").innerHTML=tab.daily.rain_sum[i] + "(mm)" + "<br>";
        g++;
      }

      f =0 ;
      for (i = 0 ;i <= 6; i++) {
        document.getElementById("ml_" + f + "").innerHTML=tab.daily.temperature_2m_max[i] + "°c" + "<br>";

        f++;
      }
      k = 0;
      for ( i = 0; i <= 6; i++) {
        document.getElementById("mc_" + k + "").innerHTML=tab.daily.temperature_2m_min[i] + "°c" + "<br>";

        k++;
      }

    }
    xhr.send();
    
  });
} else {
  console.log("La géolocalisation n'est pas prise en charge par ce navigateur.");
}
