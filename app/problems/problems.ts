export const problems = [
  {
    id: "1",
    title: "Sum of Two Numbers",
    difficulty: "Easy",
    description: `Write a function that takes two integers as input and returns their sum.

Example:
Input: 4 5
Output: 9

Input Format:
- A single line containing two space-separated integers

Output Format:
- A single integer representing the sum`,
    starterCode: `# Read two numbers from input
a, b = map(int, input().split())

# Your code here
def solve(a, b):
    pass  # Replace this with your code

# Print the result
print(solve(a, b))`,
    testCases: [
      { input: "4 5", output: "9" },
      { input: "-2 8", output: "6" },
      { input: "0 0", output: "0" }
    ]
  },
  {
    id: "2",
    title: "Even or Odd",
    difficulty: "Easy",
    description: `Write a program that determines if a number is even or odd.

Example:
Input: 4
Output: Even

Input Format:
- A single integer

Output Format:
- String "Even" or "Odd" (case-sensitive)`,
    starterCode: `# Read number from input
n = int(input())

# Your code here
def solve(n):
    pass  # Replace this with your code

# Print the result
print(solve(n))`,
    testCases: [
      { input: "4", output: "Even" },
      { input: "3", output: "Odd" },
      { input: "0", output: "Even" }
    ]
  },
  {
    id: "3",
    title: "Reverse String",
    difficulty: "Easy",
    description: `Write a program that reverses a given string.

Example:
Input: hello
Output: olleh

Input Format:
- A single line containing a string

Output Format:
- The reversed string`,
    starterCode: `# Read string from input
s = input()

# Your code here
def solve(s):
    pass  # Replace this with your code

# Print the result
print(solve(s))`,
    testCases: [
      { input: "hello", output: "olleh" },
      { input: "python", output: "nohtyp" },
      { input: "a", output: "a" }
    ]
  },
  {
    id: "4",
    title: "Count Vowels",
    difficulty: "Easy",
    description: `Write a program that counts the number of vowels (a, e, i, o, u) in a given string.

Example:
Input: hello
Output: 2

Input Format:
- A single line containing a string

Output Format:
- An integer representing the count of vowels`,
    starterCode: `# Read string from input
s = input()

# Your code here
def solve(s):
    pass  # Replace this with your code

# Print the result
print(solve(s))`,
    testCases: [
      { input: "hello", output: "2" },
      { input: "python", output: "1" },
      { input: "aeiou", output: "5" }
    ]
  },
  {
    id: "5",
    title: "Maximum of Three Numbers",
    difficulty: "Easy",
    description: `Write a program that finds the maximum of three numbers.

Example:
Input: 1 3 2
Output: 3

Input Format:
- A single line containing three space-separated integers

Output Format:
- A single integer representing the maximum value`,
    starterCode: `# Read three numbers from input
a, b, c = map(int, input().split())

# Your code here
def solve(a, b, c):
    pass  # Replace this with your code

# Print the result
print(solve(a, b, c))`,
    testCases: [
      { input: "1 3 2", output: "3" },
      { input: "-1 -5 -3", output: "-1" },
      { input: "5 5 5", output: "5" }
    ]
  }
];