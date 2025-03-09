
import classBaseService from './class-base-service';
import classQueryService from './class-query-service';

/**
 * Combined class service with all functionality
 */
class ClassService {
  // Core CRUD operations
  getAll = classBaseService.getAll.bind(classBaseService);
  getById = classBaseService.getById.bind(classBaseService);
  create = classBaseService.create.bind(classBaseService);
  update = classBaseService.update.bind(classBaseService);
  delete = classBaseService.delete.bind(classBaseService);
  
  // Specialized queries
  getAllWithStudentCount = classQueryService.getAllWithStudentCount.bind(classQueryService);
  getByFacility = classQueryService.getByFacility.bind(classQueryService);
}

export const classService = new ClassService();
