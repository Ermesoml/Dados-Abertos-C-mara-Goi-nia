var app = new Vue({
  el: '#app',
  data: {
    deputados: [],
    deputados_filtrados: [],
    filtro_deputados: '',
    filtro_partidos: '',
    processando: false
  },
  methods: {
    buscarDeputadosUrl: function(url){
      $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
        success: this.atualizarDeputados
      });
    },
    buscarDeputados: function(){
      this.processando = true;

      $.ajax({
        method: "GET",
        url: "https://dadosabertos.camara.leg.br/api/v2/deputados/?pagina=1&itens=99",
        dataType: "json",
        success: this.atualizarDeputados
      });
    },
    atualizarDeputados: function(data){
      this.deputados = this.deputados.concat(data.dados);
      this.deputados_filtrados = this.deputados;

      var has_next = false;
      for (var i = 0; i < data.links.length; i++) {
        if(data.links[i].rel == 'next'){
          this.buscarDeputadosUrl(data.links[i].href);
          has_next = true;
          break;
        }
      }

      if (!has_next)
        this.processando = false;
    },
    filtrarDeputados: function(){
      this.filtro_partidos = '';
      this.deputados_filtrados = [];
      
      if (this.filtro_deputados == '')
        this.deputados_filtrados = this.deputados;
      else{
        for (var i = 0; i < this.deputados.length; i++) {
          if (this.deputados[i].nome.toUpperCase().indexOf(this.filtro_deputados.toUpperCase()) > -1){
            this.deputados_filtrados.push(this.deputados[i])
          }
        }
      }
    },
    filtrarPartidos: function(){
      this.filtro_deputados = '';
      this.deputados_filtrados = [];
      
      if (this.filtro_partidos == '')
        this.deputados_filtrados = this.deputados;
      else{
        for (var i = 0; i < this.deputados.length; i++) {
          if (this.deputados[i].siglaPartido.toUpperCase() == (this.filtro_partidos.toUpperCase())){
            this.deputados_filtrados.push(this.deputados[i])
          }
        }
      }
    }
  },
  created: function(){
    this.buscarDeputados();
  }
})