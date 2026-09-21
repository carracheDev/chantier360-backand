import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MaterialsService } from './materials.service.js';

const companyId = '11111111-1111-4111-8111-111111111111';

describe('MaterialsService', () => {
  const materialFindMany = vi.fn();
  const materialCreate = vi.fn();
  let service: MaterialsService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new MaterialsService({
      material: { findMany: materialFindMany, create: materialCreate },
    } as never);
  });

  it('lists materials from the current company only', async () => {
    materialFindMany.mockResolvedValue([]);

    await service.findAll(companyId);

    expect(materialFindMany).toHaveBeenCalledWith(expect.objectContaining({ where: { companyId } }));
  });

  it('stores decimal-safe material thresholds', async () => {
    materialCreate.mockResolvedValue({ id: 'material-id' });

    await service.create(companyId, { name: ' Ciment ', unit: ' sac ', minimumStock: 20.5 });

    expect(materialCreate).toHaveBeenCalledWith(expect.objectContaining({
      data: { companyId, name: 'Ciment', unit: 'sac', minimumStock: '20.5' },
    }));
  });
});
