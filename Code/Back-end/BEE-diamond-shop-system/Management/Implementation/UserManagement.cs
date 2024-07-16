using BusinessObjects.DTO;
using BusinessObjects.DTO.Bill;
using BusinessObjects.DTO.BillReqRes;
using BusinessObjects.DTO.ResponseDto;
using BusinessObjects.Models;
using Management.Interface;
using Services.Interface;

namespace Management.Implementation
{
    public class UserManagement(IJewelryService jewelryService, IUserService userService, IBillService billService, ITokenService tokenService) : IUserManagement
    {
        public IJewelryService JewelryService { get; } = jewelryService;
        private IUserService UserService { get; } = userService;
        private IBillService BillService { get; } = billService;
        private ITokenService TokenService { get; } = tokenService;

        public async Task<TokenResponseDto?> Login(LoginDto loginDto)
        {
            var user = await UserService.Login(loginDto);
            if (user == null) return null;
            var token = await TokenService.CreateToken(user);
            return token;
        }

        public async Task<IEnumerable<UserDto?>?> GetUsers(int? roleId, int? counterId, bool? hasCounter)
        {
            return await UserService.GetUsers(roleId, counterId, hasCounter);
        }

        public async Task<IEnumerable<BillDetailDto?>?> GetBills(int type)
        {
            return await BillService.GetBills(type);
        }

        public async Task<BillDetailDto?> GetBillById(int id)
        {
            return await BillService.GetById(id);
        }

        public async Task<ServiceResponse> CreateBill(BillRequestDto billRequestDto)
        {
            return await BillService.Create(billRequestDto);
        }

        public async Task<User?> GetUserById(int id)
        {
            return await UserService.GetUserById(id);
        }

        public async Task<ServiceResponse> AddUser(UserDto userDto)
        {
            return await UserService.AddUser(userDto);
        }

        public async Task<int> UpdateUser(int id, UserDto user)
        {
            return await UserService.UpdateUser(id, user);
        }

        public async Task<int> DeleteUser(int id)
        {
            return await UserService.DeleteUser(id);
        }

        public async Task<ServiceResponse> PayNow(int billId)
        {
            return await BillService.PayNow(billId);
        }
    }
}