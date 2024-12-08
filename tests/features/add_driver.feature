Feature: Add driver
  Scenario: Admin adds a new driver
    Given I am on the login page
    When I login with "admin" and "letmein"
    And I add a driver with name "Mario", age "12-15", and skill "Advanced"
    Then I should see "Mario" in the driver list