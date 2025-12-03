import axios from 'axios';

//colocar seu ip nesta baseURL para o funcionamento da api e ligar o site laravel pelo php artisan serve
//ip Carlos: 187.10.13.65
//ip Fábio: 200.53.197.187
//lembrem que o ip pode mudar ent caso nao funcione digite no cmd o seguinte comando curl https://api.ipify.org
const api = axios.create({
    baseURL: 'http://xxx.xxx.xxx:8000/api', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export default api;