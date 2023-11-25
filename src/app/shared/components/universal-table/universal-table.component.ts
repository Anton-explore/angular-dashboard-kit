import {
  Component,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {
  faArrowUpWideShort,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';

import { TableColumnsType } from 'src/app/models/types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-universal-table',
  templateUrl: './universal-table.component.html',
  styleUrls: ['./universal-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversalTableComponent<DataSourceType>
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() columns: TableColumnsType<DataSourceType>[] = [];
  @Input() dataSource!: DataSourceType[];
  @Input() cellClasses: { [key: string]: string } = {};
  @Input() errorMessage: string | null = null;

  @Output() elementEdited: EventEmitter<number> = new EventEmitter<number>();
  @Output() elementDeleted: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  sortIcon = faArrowUpWideShort;
  filterIcon = faFilter;
  userAvatar = 'assets/images/user_avatar.jpg';
  filterValue = '';
  isFilterVisible = false;

  displayedColumns!: string[];
  data!: MatTableDataSource<DataSourceType>;
  private destroy$ = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.data = new MatTableDataSource<DataSourceType>();
    this.displayedColumns = this.columns.map(c => c.columnDef);
  }

  ngAfterViewInit() {
    this.initSortingAndPagination();
    this.cdr.detectChanges();
  }

  private initSortingAndPagination() {
    if (this.dataSource) {
      this.data.data = this.dataSource;
    }
    if (this.data) {
      this.data.paginator = this.paginator;
      this.data.sort = this.sort;
    }
    this.sort.sortChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.paginator.pageIndex = 0));
  }

  applyFilter() {
    if (this.data) {
      this.data.filter = this.filterValue.trim().toLowerCase();
      if (this.data.paginator) {
        this.data.paginator.firstPage();
      }
    }
  }

  clearFilter() {
    this.filterValue = '';
    this.applyFilter();
  }

  toggleFilter() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  deleteElement(id: number): void {
    this.elementDeleted.emit(id);
  }

  editElement(id: number): void {
    this.elementEdited.emit(id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
