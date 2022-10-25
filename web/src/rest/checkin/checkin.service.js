import { BaseService } from "../base-service";
import { API_ENDPOINTS } from "../endpoints";
import moment from "moment";

class Checkin extends BaseService {
  getCheckIn() {
    return this.http.get(`${this.basePath}`).then((res) => res.data);
  }
  postCheckIn(data) {
    return this.http.post(`${this.basePath}`, data).then((res) => res.data);
  }
  getTodayCheckIn() {
    return this.http.get(`${this.basePath}/today`).then((res) => res.data);
  }
}

export const CheckinService = new Checkin("checkin");
