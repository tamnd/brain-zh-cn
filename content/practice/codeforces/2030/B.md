---
 标题：“CF 2030B - 最小化单一性”
 描述：“我们需要构造一个长度为n的二进制字符串，其值$$is as small as possible. Here, f(s) counts all non-empty subsequences consisting entirely of 0s, while g(s) counts all non-empty subsequences that contain at least one 1." date: "2026-06-08T11:55:35+07:00" tags: ["codeforces", "competitive-programming", "combinatorics", "constructive-algorithms", "games", "math"] categories: ["algorithms"] codeforces_contest: 2030 codeforces_index: "B" codeforces_contest_name: "Codeforces Round 979 (Div. 2)" rating: 800 weight: 2030 solve_time_s: 99 verified: true draft: false --- [CF 2030B - Minimise Oneness](https://codeforces.com/problemset/problem/2030/B) **Rating:** 800   **Tags:** combinatorics, constructive algorithms, games, math   **Solve time:** 1m 39s   **Verified:** yes   ## Solution ## Problem Understanding We need to construct a binary string of length `n` whose value$$|f(s)-g(s)|$$
is as small as possible.
Here, `f(s)` counts all non-empty subsequences consisting entirely of `0`s, while `g(s)` counts all non-empty subsequences that contain at least one `1`. Different ways to choose positions are counted separately, even if they produce the same sequence of characters.
The input gives several values of `n`, and for each one we may output any binary string of length `n` achieving the minimum possible oneness.
The first thing to understand is how subsequences are counted. If a string contains `z` zeros, every non-empty subset of those zero positions forms an all-zero subsequence. Thus
$$f(s)=2^z-1。$$
The total number of non-empty subsequences of a length-`n` string is
$$2^n-1。$$
Since every non-empty subsequence either contains only zeros or contains at least one one, we have
$$g(s)=(2^n-1)-f(s)。$$
Substituting the formula for `f` gives
$$g(s)=2^n-2^z。$$
The constraints are very small from the construction perspective. The sum of all lengths is at most `2·10^5`, which means we can output a string directly for every test case. Any solution that performs only linear work per test case is easily fast enough.
A common mistake is to focus on the arrangement of zeros and ones. For example, one might compare `0011` and `0101` and try to count subsequences differently. The formulas above show that only the number of zeros matters. The positions of the characters have no effect on `f` or `g`.
Another subtle case is `n = 1`.
For `"0"`:
$$f=1,\quad g=0,\quad |f-g|=1。$$
For `"1"`:
$$f=0,\quad g=1,\quad |f-g|=1。$$
The minimum is still `1`, so either answer is valid.
For `n = 2`, a naive intuition might suggest balancing the counts exactly. That is impossible:
- `"00"` gives difference `3`
- `"11"` gives difference `3`
- `"01"` gives difference `1`
- `"10"` gives difference `1`
The minimum achievable value is `1`.
## Approaches
A brute-force solution would try every binary string of length `n`, compute `f` and `g`, and choose the best one.
There are `2^n` possible strings. Even for `n = 50` this is already completely infeasible, and the actual limit is `2·10^5`.
The key observation is that the order of characters does not matter at all.
Suppose the string contains exactly `z` zeros. Then:
$$f=2^z-1,$$
because every non-empty subset of zero positions creates an all-zero subsequence.
Since all remaining subsequences belong to `g`,
$$g=2^n-2^z。$$
The objective becomes
$$|f-g|
 =
 |(2^z-1)-(2^n-2^z)|
 =
 |2^{z+1}-2^n-1|。$$
Now the problem depends only on `z`.
We want `2^{z+1}` to be as close as possible to `2^n+1`.
Because powers of two grow exponentially, the closest choice is obtained when
$$z+1=n，$$
that is,
$$z=n-1。$$
Substituting:
$$|2^{n}-2^n-1|=1。$$
So any string containing exactly one `1` and `n-1` zeros has oneness equal to `1`.
Can we do better than `1`? No.
The quantity
$$2^{z+1}-2^n$$
is always an integer, so
$$|2^{z+1}-2^n-1|$$
cannot be zero because that would require
$$2^{z+1}-2^n=1,$$
but the difference of two powers of two is never `1` unless one exponent is zero, which cannot occur here. Hence the minimum possible value is at least `1`, and we have already constructed strings achieving `1`.
So the entire problem reduces to printing any binary string with exactly one `1`.
A particularly simple choice is:
- first character = `1`
- remaining `n-1` characters = `0`
### Comparison
| Approach | Time Complexity | Space Complexity | Verdict |
| --- | --- | --- | --- |
| Brute Force | O(2^n · n) | O(1) | Too slow |
| Optimal | O(n) | O(1) extra | Accepted |
## Algorithm Walkthrough
1. Read `n`.
2. Construct a string consisting of one `'1'` followed by `n-1` copies of `'0'`.
3. Output the string.
The reason this works is that the string contains exactly one `1` and `n-1` zeros.
### Why it works
Let `z` be the number of zeros.
For any binary string,
$$f=2^z-1,$$
and
$$g=2^n-2^z。$$
Hence
$$|f-g|
 =
 |2^{z+1}-2^n-1|。$$
The value is minimized when `z = n-1`, giving
$$|2^n-2^n-1|=1。$$
A smaller value is impossible because achieving `0` would require the difference of two powers of two to equal `1`, which never happens in this setting.
Our construction has exactly `n-1` zeros, so it attains the minimum possible oneness.
## Python Solution
⟦PROTECT_0⟧
The implementation directly follows the mathematical result.
For each test case we output a string containing exactly one `1`. The position does not matter, because the objective depends only on the number of zeros. Choosing the first position keeps the construction simple.
The expression `'0' * (n - 1)` automatically becomes an empty string when `n = 1`, producing `"1"`, which is a valid optimal answer. No special case is required.
No large integer arithmetic appears in the code. The proof uses powers of two, but the implementation never computes them.
## Worked Examples
### Example 1
Input:
⟦PROTECT_1⟧
Output produced by the algorithm:
⟦PROTECT_2⟧
| Step | n | Constructed string |
| --- | --- | --- |
| Read input | 3 | - |
| Build answer | 3 | 100 |
| Output | 3 | 100 |
For `"100"`, there are two zeros.
$$f=2^2-1=3$$
and
$$g=2^3-2^2=4。$$
The oneness is
$$|3-4|=1。$$
This demonstrates the optimal value.
### Example 2
Input:
⟦PROTECT_3⟧
Output produced by the algorithm:
⟦PROTECT_4⟧
| Step | n | Number of zeros | Constructed string |
| --- | --- | --- | --- |
| Read input | 5 | - | - |
| Build answer | 5 | 4 | 10000 |
| Output | 5 | 4 | 10000 |
Here
$$f=2^4-1=15,$$
$$g=2^5-2^4=16,$$
so
$$|f-g|=1。$$
Again the minimum possible value is achieved.
## Complexity Analysis
| Measure | Complexity | Explanation |
| --- | --- | --- |
| Time | O(n) | Constructing the output string requires writing `n` characters |
| Space | O(1) extra | Only the output string itself is stored |
The total length over all test cases is at most `2·10^5`, so generating and printing the strings is comfortably within the limits.
## Test Cases
⟦PROTECT_5⟧
| Test input | Expected output | What it validates |
| --- | --- | --- |
| `1\n1\n` | `1` | Smallest possible length |
| `1\n2\n` | `10` | First non-trivial case |
| `1\n5\n` | `10000` | General construction |
| `4\n1\n3\n4\n6\n` | Corresponding strings | Multiple test case handling |
## Edge Cases
Consider `n = 1`.
Input:
⟦PROTECT_6⟧
The algorithm outputs:
⟦PROTECT_7⟧
Here
$$f=0,\quad g=1,$$
so the oneness is `1`. Since zero is unattainable, this is optimal.
Consider `n = 2`.
Input:
⟦PROTECT_8⟧
The algorithm outputs:
⟦PROTECT_9⟧
There is one zero, so
$$f=1，$$
and
$$g=2.$$
 一体性等于`1`。 这与长度二的最小可实现值相匹配。 
考虑一个大值，例如`n = 200000`。 
该算法简单地生成一个`'1'`和`199999`零。 不执行子序列计数，也不计算 2 的大幂。 运行时间与输出大小保持线性关系，这正是约束所允许的。
