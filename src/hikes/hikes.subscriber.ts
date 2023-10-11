import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
  } from 'typeorm';
  import { Hike } from 'src/hikes/hikes.entity';
import { HikesService } from './hikes.service';
  
  @EventSubscriber()
  export class HikeSubscriber implements EntitySubscriberInterface<Hike> {
    constructor(
        private readonly hikeService : HikesService,
        dataSource: DataSource) {
            dataSource.subscribers.push(this);
        }
  
    listenTo() {
      return Hike;
    }
  
    beforeInsert(event: InsertEvent<Hike>) {
      this.calculateDifficulty(event.entity);
    }
  
    beforeUpdate(event: UpdateEvent<Hike>) {
      this.calculateDifficulty(event.databaseEntity as Hike);
    }
  
    calculateDifficulty(hike: Hike) {
      hike.difficulty = this.hikeService.calculateDifficulty(hike);
    }
  }
  