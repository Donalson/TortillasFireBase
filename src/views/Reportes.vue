<template>
  <v-container>

    <template v-if="C">
    <!-- Encabezado de la pagina -->
    <v-toolbar flat>
      <v-toolbar-title>Reportes</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <!-- Campo de filtrado de ventas -->
      <v-text-field
        v-model="Buscar"
        append-icon="mdi-magnify"
        label="Buscar"
        single-line
        hide-details
        color="green"
      ></v-text-field>
      <v-spacer></v-spacer>
    </v-toolbar>
    </template>

    <v-row wrap>
      <!-- Reportes Pedidos -->
      <v-col cols="12">
        <!-- Inicio de card -->
        <v-card
          class="mx-auto text-center"
          color="green"
          dark
        >
        <!-- Encabezado de card -->
        <v-card-text>
          <div class="display-1 font-weight-thin">
            Pedidos de Tortillas
          </div>
          <!-- Filtros -->
          <v-row wrap>
            <!-- Select -->
            <v-col cols="6">
              <v-select
                :items="[{text:'Todos',valor:'Todos'},{text:'Año',valor:'year'},{text:'Mes',valor:'month'},{text:'Dia',valor:'date'}]"
                item-text="text"
                item-value="valor"
                v-model="Selects.PedidosPor"
                label="Pedidos por"
                @change="Fechas.FechaPedido = null;if(Selects.PedidosPor == 'Todos'){GetPedidos('Todos',null)}"
              ></v-select>
            </v-col>
            <!-- Selector de Fecha -->
            <v-col cols="6">
              <v-menu
                v-if="Selects.PedidosPor!='Todos' && Selects.PedidosPor!='year'"
                v-model="Fechas.PedidosModel"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    label="Selector"
                    v-model="Fechas.FechaPedido"
                    prepend-icon="mdi-calendar"
                    color="green"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <!-- DatePickers-->
                <v-date-picker v-if="Selects.PedidosPor == 'date'"
                  v-model="Fechas.FechaPedido"
                  year-icon="mdi-calendar-blank"
                  prev-icon="mdi-skip-previous"
                  next-icon="mdi-skip-next"
                  color="green"
                  @input="Fechas.PedidosModel = false"
                  @change="GetPedidos(Selects.PedidosPor,Fechas.FechaPedido)"
                ></v-date-picker>
                <v-date-picker v-if="Selects.PedidosPor == 'month'"
                  v-model="Fechas.FechaPedido"
                  type="month"
                  year-icon="mdi-calendar-blank"
                  prev-icon="mdi-skip-previous"
                  next-icon="mdi-skip-next"
                  color="green"
                  @input="Fechas.PedidosModel = false"
                  @change="GetPedidos(Selects.PedidosPor,Fechas.FechaPedido)"
                ></v-date-picker>
              </v-menu>
              <v-select v-if="Selects.PedidosPor=='year'"
                  :items="[2018,2019,2020,2021]"
                  v-model="Fechas.FechaPedido"
                  label="Año"
                  @change="GetPedidos(Selects.PedidosPor,Fechas.FechaPedido)"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <!-- Grafico de pay de Pedidos -->
        <v-card-text>
          <GChart
            type="PieChart"
            :data="TortillasData"
            :options="charts.chartTortillas"
          />
        </v-card-text>
        </v-card>
      </v-col>
      <!-- Reportes Clientes -->
      <v-col cols="12">
        <v-card
          class="mx-auto text-center"
          color="green"
          dark
        >

        <v-card-text>
          <div class="display-1 font-weight-thin">
            Pedidos de Clientes
          </div>

          <v-row wrap>
            <!-- Select Fecha -->
            <v-col cols="4">
              <v-select
                :items="[{text:'Todos',valor:'Todos'},{text:'Año',valor:'year'},{text:'Mes',valor:'month'},{text:'Dia',valor:'date'}]"
                item-text="text"
                item-value="valor"
                v-model="Selects.ClientesPor"
                label="Ventas por"
                @change="Fechas.FechaCliente = null;if(Selects.ClientesPor == 'Todos'){GetClientes()}"
              ></v-select>
            </v-col>
            <!-- Selector de Fecha -->
            <v-col cols="4">
              <v-menu
                v-if="Selects.ClientesPor!='Todos' && Selects.ClientesPor!='year'"
                v-model="Fechas.ClientesModel"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    label="Selector"
                    v-model="Fechas.FechaCliente"
                    prepend-icon="mdi-calendar"
                    color="green"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <!-- DatePickers-->
                <v-date-picker v-if="Selects.ClientesPor == 'date'"
                  v-model="Fechas.FechaCliente"
                  year-icon="mdi-calendar-blank"
                  prev-icon="mdi-skip-previous"
                  next-icon="mdi-skip-next"
                  color="green"
                  @input="Fechas.ClientesModel = false"
                  @change="GetClientes()"
                ></v-date-picker>
                <v-date-picker v-if="Selects.ClientesPor == 'month'"
                  v-model="Fechas.FechaCliente"
                  type="month"
                  year-icon="mdi-calendar-blank"
                  prev-icon="mdi-skip-previous"
                  next-icon="mdi-skip-next"
                  color="green"
                  @input="Fechas.ClientesModel = false"
                  @change="GetClientes()"
                ></v-date-picker>
              </v-menu>
              <v-select v-if="Selects.ClientesPor=='year'"
                  :items="[2018,2019,2020,2021]"
                  v-model="Fechas.FechaCliente"
                  label="Año"
                  @change="GetClientes()"
              ></v-select>
            </v-col>
            <!-- Select Clientes -->
            <v-col cols="4">
              <v-select
                :items="ListaDeClientes"
                v-model="Selects.Cliente"
                label="Ventas por"
                @change="GetClientes()"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text>
          <GChart
            type="ColumnChart"
            :data="ClientesData"
            :options="charts.chartClientes"
          />
        </v-card-text>

        <v-divider></v-divider>
        </v-card>
      </v-col>
      <!-- Reportes Ventas -->
      <v-col cols="12">
        <v-card
          class="mx-auto text-center"
          color="green"
          dark
        >

        <v-card-text>
          <div class="display-1 font-weight-thin">
            Ventas
          </div>

          <v-row wrap>
            <!-- Select Fecha -->
            <v-col cols="4">
              <v-select
                :items="[{text:'Todas',valor:'Todas'},{text:'Año',valor:'year'},{text:'Mes',valor:'month'},{text:'Dia',valor:'date'}]"
                item-text="text"
                item-value="valor"
                v-model="Selects.VentasPor"
                label="Clientes por"
                @change="Fechas.FechaVenta = null;if(Selects.VentasPor == 'Todos'){GetVentas()}"
              ></v-select>
            </v-col>
            <!-- Selector de Fecha -->
            <v-col cols="4">
              <v-menu
                v-if="Selects.VentasPor!='Todas' && Selects.VentasPor!='year'"
                v-model="Fechas.VentasModel"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    label="Selector"
                    v-model="Fechas.FechaVenta"
                    prepend-icon="mdi-calendar"
                    color="green"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <!-- DatePickers-->
                <v-date-picker v-if="Selects.VentasPor == 'date'"
                  v-model="Fechas.FechaVenta"
                  year-icon="mdi-calendar-blank"
                  prev-icon="mdi-skip-previous"
                  next-icon="mdi-skip-next"
                  color="green"
                  @input="Fechas.VentasModel = false"
                  @change="GetVentas()"
                ></v-date-picker>
                <v-date-picker v-if="Selects.VentasPor == 'month'"
                  v-model="Fechas.FechaVenta"
                  type="month"
                  year-icon="mdi-calendar-blank"
                  prev-icon="mdi-skip-previous"
                  next-icon="mdi-skip-next"
                  color="green"
                  @input="Fechas.VentasModel = false"
                  @change="GetVentas()"
                ></v-date-picker>
              </v-menu>
              <v-select v-if="Selects.VentasPor=='year'"
                  :items="[2018,2019,2020,2021]"
                  v-model="Fechas.FechaVenta"
                  label="Año"
                  @change="GetVentas()"
              ></v-select>
            </v-col>
            <!-- Select Clientes -->
            <v-col cols="4">
              <v-select
                :items="ListaDeClientesV"
                v-model="Selects.ClienteV"
                label="Ventar por"
                @change="GetVentas()"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text>
          <GChart
            type="PieChart"
            :data="VentasData"
            :options="charts.chartVentas"
          />
        </v-card-text>

        <v-divider></v-divider>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import axios from "axios";
import { mapMutations } from 'vuex';
import alertify from "vue-alertify";
import moment from 'moment';
export default {
  data() {
    return{
      //Arrays de informacion
      Clientes: [],Tortillas: [],Pedidos:[], Ventas: [],TortillasData:[],ClientesData:[],VentasData:[],ListaDeClientes:[],ListaDeClientesV:[],
      //Variables
      C:false,
      //Filtros de reportes
      Selects:{
        PedidosPor:'Todos',
        ClientesPor:'Todos',
        Cliente:'Todos',
        VentasPor:'Todas',
        ClienteV:'Todos'
      },
      Fechas:{
        PedidosModel:false,
        FechaPedido:'',
        ClientesModel:false,
        FechaCliente:'',
        VentasModel:false,
        FechaVenta:''
      },
      //Configuraciones de los graficos
      charts:{
        chartTortillas: {
          title: 'Pedidos de Tortillas',
          width: '100%',
          height: 300,
        },
        chartClientes: {
          title: 'Pedidos de Clientes',
          width: '100%',
          height: 300,
        },
        chartVentas: {
          title: 'Ventas',
          width: '100%',
          height: 300,
        },
      }
    };
  },

  created() {
    this.MostrarLoading({Titulo:'Accediendo a la información', Color:'green'})
    this.GetTortillas();this.GetPedidos('Todos',null);this.GetClientes();this.GetVentas()
    this.OcultarLoading() 
  },

  computed: {
  },

  methods: {
    ...mapMutations(['MostrarLoading','OcultarLoading']),

    async GetClientes(){
      //Obtener Clientes
      let Clientes
      this.Clientes = []
      try {
        await axios.get(`http://192.168.1.4:3000/Clientes`).then((res)=>{
          Clientes = res.data
        })
      } catch (error) {
        console.log(error)
      }
      
      //Filtrar Clientes
      this.ClientesData = []
      this.ClientesData.push(['Cliente','Pequeña','Mediana','Grande'])
      this.ListaDeClientes = []
      this.ListaDeClientes.push("Todos")

      let PedidosF = []
      if(this.Selects.ClientesPor == "Todos"){PedidosF = this.Pedidos}
      else {PedidosF = this.Pedidos.filter((item) => item.Fecha.includes(this.Fechas.FechaCliente))}

      for(var cliente = 0;cliente < Clientes.length;cliente++){
        let id = Clientes[cliente].IdCliente,FullName = Clientes[cliente].Nombres + " " + Clientes[cliente].Apellidos;
        Clientes[cliente].FullName = FullName
        Clientes[cliente].Pedidos = {Pequeñas:0,Medianas:0,Grandes:0}
        this.ListaDeClientes.push(FullName)
        //Recorrer Pedidos por cada cliente
        for(var pedido = 0; pedido < PedidosF.length;pedido++){
          if(PedidosF[pedido].Cliente == id){
            if(PedidosF[pedido].Tortilla == 3){
              Clientes[cliente].Pedidos.Pequeñas += PedidosF[pedido].Cantidad
            }
            if(PedidosF[pedido].Tortilla == 2){
              Clientes[cliente].Pedidos.Medianas += PedidosF[pedido].Cantidad
            }
            if(PedidosF[pedido].Tortilla == 1){
              Clientes[cliente].Pedidos.Grandes += PedidosF[pedido].Cantidad
            }
          }
        }
        this.ClientesData.push([
          Clientes[cliente].FullName,
          Clientes[cliente].Pedidos.Pequeñas,
          Clientes[cliente].Pedidos.Medianas,
          Clientes[cliente].Pedidos.Grandes,
        ])
      }
      if(this.Selects.Cliente != "Todos"){
        let Viejos = this.ClientesData
        this.ClientesData = []
        this.ClientesData.push(['Cliente','Pequeña','Mediana','Grande'])
        for(let i = 0;i<Viejos.length;i++){
          if(Viejos[i][0]==this.Selects.Cliente){
            this.ClientesData.push(Viejos[i])
          }
        }
        if(!this.ClientesData[1][1]>0){this.$alertify.error('No hay pedidos del Cliente ' + this.Selects.Cliente)}
      }
      this.Clientes = await Clientes
    },

    async GetTortillas(){
      let Tortillas
      try {
        await axios.get(`http://192.168.1.4:3000/Tortillas`).then((res)=>{
          Tortillas = res.data
        })
      } catch (error) {
        console.log(error)
      }
      this.Tortillas = await Tortillas
    },

    async GetPedidos(Modo,Valor){
      //Guardar Todos los pedidos
      this.Pedidos = []
      var Pedidos,Peq=0,Med=0,Gra=0
      try {
        await axios.get(`http://192.168.1.4:3000/Pedidos`).then((res)=>{
          Pedidos = res.data
        })
      } catch (error) {
        console.log(error)
      }
      this.Pedidos = await Pedidos

      //Ordernas los datos para graficos
      let PedidosF = []
      if(Modo == "Todos"){PedidosF = Pedidos}
      else{PedidosF = Pedidos.filter( (item) => item.Fecha.includes(Valor))}
      for(let i = 0;i < PedidosF.length; i++){
        if(PedidosF[i].Tortilla == 1){
          Gra = Gra + parseInt(PedidosF[i].Cantidad)
        }
        if(PedidosF[i].Tortilla == 2){
          Med = Med + parseInt(PedidosF[i].Cantidad)
        }
        if(PedidosF[i].Tortilla == 3){
          Peq = Peq + parseInt(PedidosF[i].Cantidad)
        }
      }
      if(Peq > 0 || Med > 0 || Gra > 0){
        this.TortillasData = []
        this.TortillasData.push(
          ['Tortilla','Cantidad'],
          ['Pequeña', parseInt(Peq)],
          ['Mediana', parseInt(Med)],
          ['Grande', parseInt(Gra)]
        )
      }else{
        this.$alertify.error("No hay pedidos para " + Valor)
      }
    },

    async GetVentas(){
      let Ventas
      this.VentasData = []
      this.VentasData.push(['Cliente','Total'])
      this.ListaDeClientesV = []
      this.ListaDeClientesV.push('Todos')
      try {
        await axios.get(`http://192.168.1.4:3000/Ventas`).then((res)=>{
          Ventas = res.data
        })
      } catch (error) {
        console.log(error)
      }
      for(var cliente = 0;cliente < this.Clientes.length;cliente++){
        let id = this.Clientes[cliente].IdCliente
        let FullName = this.Clientes[cliente].Nombres + " " + this.Clientes[cliente].Apellidos
        this.ListaDeClientesV.push(FullName)
        var Total = 0
        
        await axios.get(`http://192.168.1.4:3000/VentasDe/${id}`).then((res) => {
          let Temp = []
          if(this.Selects.VentasPor == "Todas"){Temp=res.data}
          else{Temp = res.data.filter(item=>item.Fecha.includes(this.Fechas.FechaVenta))}
          for(var i = 0;i<Temp.length;i++){
            Total += parseFloat(Temp[i].Total)
          }
        });
        this.VentasData.push([
          FullName,
          Total
        ])
      }
      this.Ventas = []
      this.Ventas = await Ventas
      if(this.Selects.ClienteV!="Todos"){
        let Viejos = this.VentasData
        this.VentasData = []
        this.VentasData.push(['Cliente','Total'])
        for(let i = 0;i<Viejos.length;i++){
          if(Viejos[i][0]==this.Selects.ClienteV){
            this.VentasData.push(Viejos[i])
          }
        }
        if(!this.VentasData[1][1]>0){this.$alertify.error('No hay ventas del Cliente ' + this.Selects.ClienteV)}
      }
      if(this.VentasData.length!=2){
        let Total = 0
        for(var i = 1;i<this.VentasData.length;i++){
          Total+=this.VentasData[i][1]
        }
        if(Total==0){this.$alertify.error('No hay ventas de ' + this.Fechas.FechaVenta)}
      }
    },
  },
};
</script>