import { signal } from "@angular/core";
import { JSONObject } from "@ng-vagabond-lab/ng-dsv/api";
import { removeDuplicate } from "./utils/store.utils";

export class Store<T> {

    data = signal<T[]>([]);

    update(id: number, data: T, add?: JSONObject) {
        this.data.update((values) => {
            values[id] = { ...data, ...add };
            return [...values];
        });
    }

    updateForPage(page: number, data: T[]) {
        this.data.update((values) => {
            let newValues = page === 1 ? [] : [...values];
            return [...removeDuplicate([...newValues, ...data])];
        });
    }
}