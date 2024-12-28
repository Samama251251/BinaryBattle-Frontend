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
    starterCode: `def solve(a: int, b: int) -> int:
    """
    Calculate the sum of two numbers
    Args:
        a: first integer
        b: second integer
    Returns:
        The sum of a and b
    """
    # Write your code here
    pass

# Do not modify below this line
if __name__ == "__main__":
    a, b = map(int, input().split())
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
    description: `Write a program that determines if a number is even or odd.`,
    starterCode: `def solve(n: int) -> str:
    """
    Determine if a number is even or odd
    Args:
        n: input integer
    Returns:
        'Even' if the number is even, 'Odd' if the number is odd
    """
    # Write your code here
    pass

# Do not modify below this line
if __name__ == "__main__":
    n = int(input())
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
    description: `Write a program that reverses a given string.`,
    starterCode: `def solve(s: str) -> str:
    """
    Reverse the input string
    Args:
        s: input string
    Returns:
        The reversed string
    """
    # Write your code here
    pass

# Do not modify below this line
if __name__ == "__main__":
    s = input()
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
    description: `Write a program that counts the number of vowels (a, e, i, o, u) in a given string.`,
    starterCode: `def solve(s: str) -> int:
    """
    Count the number of vowels in the input string
    Args:
        s: input string
    Returns:
        The number of vowels (a, e, i, o, u) in the string
    """
    # Write your code here
    pass

# Do not modify below this line
if __name__ == "__main__":
    s = input()
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
    description: `Write a program that finds the maximum of three numbers.`,
    starterCode: `def solve(a: int, b: int, c: int) -> int:
    """
    Find the maximum of three numbers
    Args:
        a: first integer
        b: second integer
        c: third integer
    Returns:
        The maximum value among a, b, and c
    """
    # Write your code here
    pass

# Do not modify below this line
if __name__ == "__main__":
    a, b, c = map(int, input().split())
    print(solve(a, b, c))`,
    testCases: [
      { input: "1 3 2", output: "3" },
      { input: "-1 -5 -3", output: "-1" },
      { input: "5 5 5", output: "5" }
    ]
  }
];