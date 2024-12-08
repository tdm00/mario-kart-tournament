Feature: Add drivers and verify spectator page

  Scenario: Add drivers for each skill level and age range
    Given I am on the admin login page
    When I log in with the password "letmein"
    And I add a driver named "Driver1" with age range "5-8" and skill level "Beginner"
    And I add a driver named "Driver2" with age range "9-11" and skill level "Intermediate"
    And I add a driver named "Driver3" with age range "12-15" and skill level "Advanced"
    And I add a driver named "Driver4" with age range "16-20" and skill level "Expert"
    Then the spectator page should display the drivers sorted by their total scores