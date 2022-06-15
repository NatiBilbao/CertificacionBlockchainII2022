const Notes = artifacts.require("Notes");

contract("Notes", accounts => {

    let instance

    beforeEach("deploy a contract", async () => {
        instance = await Notes.new();
    })

    it("Allows a student to be evaluated", async () =>{
        const res = await instance.Evaluar("Ken", 100, {from: accounts[0]})
        const student = web3.utils.keccak256("Ken")
        const note = await instance.VerNotas.call("Ken")
        assert.equal(student, res.logs[0].args[0])
        assert.equal(100,note)
    })

    it("Only allows the owner to evaluate a student", async ()=>{
        try{
            const res = await instance.Evaluar("Ken", 100, {from: accounts[8]})
        }catch(e){
            assert.equal("No tienes permisos para ejecutar esta funcion.", e.reason)
        }
    })



})