import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

export interface Electronics {
  name: string;
  model: string;
  price: number;
  specs: string;
  weight: number;
  country: string
}

let electronics_data: Electronics[] = [];
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shop-bridge';
  showList: boolean = true
  createItem: boolean = true
  name = new FormControl('', [Validators.required]);
  model = new FormControl('', [Validators.required]);
  price = new FormControl('', [Validators.required]);
  weight = new FormControl('', [Validators.required]);
  country: any = new FormControl('', [Validators.required]);
  specs = new FormControl('', [Validators.required]);
  displayedColumns: string[] = ['name', 'model', 'price', 'specs', 'weight', 'country', 'action'];
  dataSource = new MatTableDataSource<Electronics>(electronics_data);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private _snackBar: MatSnackBar, private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any>('https://api.npoint.io/08a3bbced680cbc420f9').subscribe(data => {
      electronics_data = data;
      this.dataSource = new MatTableDataSource<Electronics>(electronics_data);
      this.refreshData()
    })
  }

  ngAfterViewInit() {
    this.refreshData()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  submitForm() {
    if (this.name.value == "" || this.model.value == "" || this.price.value == "" || this.specs.value == "" || this.weight.value == "" || (this.country.value == "" && this.country.value != undefined)) {
      this._snackBar.open("Please enter missing values", "Error", {
        duration: 2000,
      });
    } else {
      this.showList = true
      electronics_data.push({ name: this.name.value, model: this.model.value, price: this.price.value, specs: this.specs.value, weight: this.weight.value, country: this.country })
      this.refreshData()
    }
  }

  refreshData() {
    setTimeout(() => {
      this.dataSource.data = this.dataSource.data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator
    }, 0)
  }

  editRow(data) {
    if (data) {
      this.name.setValue(data.name);
      this.model.setValue(data.model);
      this.price.setValue(data.price);
      this.specs.setValue(data.specs);
      this.weight.setValue(data.weight);
      this.country = data.country;
    }
  }

  addNewItem() {
    this.name.setValue("");
    this.model.setValue("");
    this.price.setValue("");
    this.specs.setValue("");
    this.weight.setValue("");
    this.country = "";
  }

  deleteRow(data) {
    electronics_data.splice(this.dataSource.filteredData.indexOf(data), 1)
    this.refreshData()
  }

  backToList() {
    this.showList = true
    this.refreshData()
  }
}


