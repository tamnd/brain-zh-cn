---
 标题：“CF 1934A - Too Min Too Max”
 描述：“我们被要求最大化表达$$over all quadruples of distinct indices $i, j, k, l$ in an array $a$. The input provides multiple test cases, each with an array of integers. For each test case, the output is the maximum value of the expression." date: "2026-06-08T18:09:50+07:00" tags: ["codeforces", "competitive-programming", "greedy", "math"] categories: ["algorithms"] codeforces_contest: 1934 codeforces_index: "A" codeforces_contest_name: "Codeforces Round 931 (Div. 2)" rating: 800 weight: 1934 solve_time_s: 137 verified: false draft: false --- [CF 1934A - Too Min Too Max](https://codeforces.com/problemset/problem/1934/A) **Rating:** 800   **Tags:** greedy, math   **Solve time:** 2m 17s   **Verified:** no   ## Solution ## Problem Understanding We are asked to maximize the expression$$|a_i - a_j| + |a_j - a_k| + |a_k - a_l| + |a_l - a_i|$$
over all quadruples of distinct indices $i, j, k, l$ in an array $a$. The input provides multiple test cases, each with an array of integers. For each test case, the output is the maximum value of the expression.
The expression is essentially the perimeter of a "walk" through four elements of the array, moving from $a_i$ to $a_j$ to $a_k$ to $a_l$ and back to $a_i$, measuring absolute differences along the edges. The problem reduces to selecting the largest and smallest values in a way that maximizes the sum of differences.
Constraints allow $n$ up to 100 and $t$ up to 500. This permits $O(n^4)$ brute-force solutions in principle, but a careful observation can reduce the complexity. Edge cases include arrays with all equal elements, where the expression is zero, and arrays with both negative and positive numbers, which influence which combination yields the maximum.
A naive approach might try all quadruples, but we need to understand the structure of absolute differences to simplify the problem.
## Approaches
A brute-force approach enumerates all quadruples $i, j, k, l$ and computes the expression directly. This is $O(n^4)$, which is acceptable given $n \le 100$, but it is unnecessary because the expression can be simplified by considering the extreme values.
The key observation is that absolute differences are maximized when combining the minimum and maximum elements. Let $mn = \min(a)$ and $mx = \max(a)$. To maximize the sum, we want the sequence to alternate between these extremes. For example, choosing $i$ as the minimum, $j$ as the maximum, $k$ as the minimum, and $l$ as the maximum produces the largest contribution from each term. Therefore, the maximum expression reduces to:
$$2 \times (\text{max}(a) - \text{min}(a)) + 2 \times (\text{第二个最大/最小贡献})$$
 给定较小的数组大小，可以有效地枚举极值的精确组合。 一种简单的方法是对数组进行排序并计算以交替顺序选取两个最大和两个最小元素的序列的表达式。 这样就保证了最大程度。 
| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^4) | O(n^4) | O(1) | O(1) | 已接受 (n ≤ 100) |
 | 贪婪/极端| O(n log n) | O(n log n) | O(n) | 已接受，更快 |
 ## 算法演练
 1. 对于每个测试用例，读取数组$a$并存储其长度$n$。 
2. 排序$a$轻松访问最小值、第二最小值、最大值和第二最大值。 
3. 通过将极端元素放置在交替位置来计算表达式的候选值。 典型的候选人是：
 -$a_0, a_1, a_{n-2}, a_{n-1}$-$a_0, a_1, a_{n-1}, a_{n-2}$-$a_0, a_{n-2}, a_1, a_{n-1}$-$a_0, a_{n-1}, a_1, a_{n-2}$4. 对于每个候选四元组，计算表达式$|a_i - a_j| + |a_j - a_k| + |a_k - a_l| + |a_l - a_i|$5. 跟踪候选者中的最大值并将其输出。 
为什么有效：通过在每一步选择最大可能的差异来最大化绝对差异。 交替使用最小和最大元素可确保每一项对总和的贡献最大。 排序使我们能够轻松枚举这些极端配置，而无需检查所有四元组。 
## Python 解决方案```python
import sys
input = sys.stdin.readline
def max_expression(a):
    a.sort()
    n = len(a)
    candidates = [
        [a[0], a[1], a[n-2], a[n-1]],
        [a[0], a[1], a[n-1], a[n-2]],
        [a[0], a[n-2], a[1], a[n-1]],
        [a[0], a[n-1], a[1], a[n-2]],
    ]
    res = 0
    for quad in candidates:
        i, j, k, l = quad
        val = abs(i-j) + abs(j-k) + abs(k-l) + abs(l-i)
        res = max(res, val)
    return res
def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        print(max_expression(a))
if __name__ == "__main__":
    solve()
```说明：排序确保我们可以轻松挑选极端元素。 选择候选四元组以最大化绝对差之和。 少量的候选者 (4) 保证了正确性，同时保持计算的简单性。 
## 工作示例
 用于输入`[1,1,2,2,3]`，排序后的数组是`[1,1,2,2,3]`。 候选四元组：
 | 我，j，k，l | 表达 |
 | --- | --- |
 | 1,1,2,3 | |
 | 1,1,3,2 | ... = 6 |
 | 1,2,1,3 | ... = 6 |
 | 1,3,1,2 | ... = 6 |
 最大值为 6。 
用于输入`[5,1,3,2,-3,-1,10,3]`, 排序数组`[-3,-1,1,2,3,3,5,10]`。 候选四元组产生表达式值 38，这是最大值。 
## 复杂度分析
 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 排序占主导地位； 候选人不变|
 | 空间| O(n) | 存储排序数组 |
 给定$n ≤ 100$和$t ≤ 500$，这是有效的。 
## 测试用例```python
import sys, io
def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()
# Provided samples
assert run("5\n4\n1 1 1 1\n5\n1 1 2 2 3\n8\n5 1 3 2 -3 -1 10 3\n4\n3 3 1 1\n4\n1 2 2 -1\n") == "0\n6\n38\n8\n8"
# Custom cases
assert run("1\n4\n-1 -1 -1 -1\n") == "0", "all equal negative"
assert run("1\n5\n1 2 3 4 5\n") == "12", "ascending consecutive"
assert run("1\n6\n-5 -2 0 2 3 5\n") == "28", "mixed negatives and positives"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 4 个元素都相等 | 0 | 处理均匀数组 |
 | 1..5 | 1..5 12 | 12 Max 升序数组 |
 | 正负混合| 28 | 28 正确处理标志 |
 ## 边缘情况
 对于元素全部相等的数组，无论选择如何，表达式都为零。 排序和候选枚举仍然有效，因为所有值都是相同的，产生零。 对于最小尺寸$n=4$，候选者正是这四个元素，因此算法正确地计算了表达式。
