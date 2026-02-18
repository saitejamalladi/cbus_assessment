


Full stack coding challenge for a senior Full Stack Engg position at cbus. I should be able to solve it right from the writing the code, unit test cases, testing, documentation, commit the code to a git repo and deploy it to AWS Lambda free tier and AWS SQL to store the data. It should cover all the bonus points. 







First hour should be finalising the tech design and implementation plan. 







Tech Stack 



1. FE: Spa - React + Typescript + Redux + Material UI



2. BE: NestJs(Node + Typescript) - Let's discuss the best approach for this to keep it simple. 



3. github Actions for CI/CD



4. Swagger for API documentation 



5. Readme Instructions root level for full stack application and individual REadme.md for both fe and be. 



6. Same repo will have both FE and BE code. 



7. github actions should be in the root level. Build for every commit, but deploy only when the commit is to the master branch. 



8. Resources: Front end: Github Wiki page for react application, AWS lambda for backend, AWS SQL for data. 



9. Insert mockdata of 1000 records into the database with the required fields. First prepare a csv file with the data and then create a script to insert the data into customers table in DB. The script and the csv can stay in the root level under lib/ or any other relevant folder in the root level. 



10. Keep all the env files in .env. Github actions should pick up the env variables properly from a secured file to deploy the changes to AWS lambda. 







**Clarifications**

1. Ask top 5 questions to clarify the requirements. 

2. Is nestjs a better approach for lambda? or we should use a light weight for this? Remember we need to cover the unit test coverage and test the build before we push the changes to lambda. 

3. Do we need a API gateway setup in AWS to reach the hosted AWS resource? 



