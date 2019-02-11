module.exports = {
    response: {
        success: (body) => {
            return {
                'status': 'ok',
                'code': 200,
                'message': 'Operação realizada com sucesso!',
                'result': body
            }
        },
        error: (error) => {
            return {
                'status': 'error',
                'code': 400,
                'message': 'Ops! Aconteceu um erro na sua operação',
                'result': [error]
            }
        }
    }
}
