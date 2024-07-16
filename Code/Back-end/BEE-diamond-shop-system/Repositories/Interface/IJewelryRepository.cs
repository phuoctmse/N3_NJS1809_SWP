using BusinessObjects.DTO.ResponseDto;
using BusinessObjects.Models;
using Repositories.Interface.GenericRepository;
namespace Repositories.Interface;

public interface IJewelryRepository : IReadRepository<JewelryResponseDto>, ICreateRepository<Jewelry>, IUpdateRepository<Jewelry>, IDeleteRepository<Jewelry>
{
}
