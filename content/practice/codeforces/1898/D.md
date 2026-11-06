---
 标题：“CF 1898D - 绝对之美”
 描述：“对于每个位置 i，我们都有一对数字 (ai, bi)。当前的美度是这对值之间的距离之和：$$sum We may choose at most one pair of indices and swap the corresponding values inside array b." date: "2026-06-08T21:31:48+07:00" tags: ["codeforces", "competitive-programming", "greedy", "math"] categories: ["algorithms"] codeforces_contest: 1898 codeforces_index: "D" codeforces_contest_name: "Codeforces Round 910 (Div. 2)" rating: 1900 weight: 1898 solve_time_s: 133 verified: true draft: false --- [CF 1898D - Absolute Beauty](https://codeforces.com/problemset/problem/1898/D) **Rating:** 1900   **Tags:** greedy, math   **Solve time:** 2m 13s   **Verified:** yes   ## Solution ## Problem Understanding For every position `i`, we have a pair of numbers `(a_i, b_i)`. The current beauty is the sum of the distances between the paired values:$$\sum |a_i-b_i|$$
We may choose at most one pair of indices and swap the corresponding values inside array `b`. After that swap, every position still contributes an absolute difference with its own `a_i`, and we want the largest possible total beauty.
A useful way to think about the problem is that every index defines an interval between its two values. If `a_i = 3` and `b_i = 8`, the pair corresponds to the interval `[3,8]`. The contribution of that index is exactly the interval length.
The total length of all intervals is already known. The only thing a swap can change is the contribution of the two indices involved in that swap.
The constraints are the real challenge. The sum of all `n` across test cases is at most `2·10^5`, which means an `O(n log n)` or `O(n)` solution is expected. Any algorithm that tries all pairs of indices would require `O(n²)` work, roughly `2·10^10` operations in the worst case, which is far beyond what can run in two seconds.
Several edge cases are easy to mishandle.
Consider:
⟦PROTECT_0⟧
The current beauty is `1 + 1 = 2`. Swapping the two elements of `b` produces `[1,2]`, whose beauty is `0`. The correct answer is `2`, because the operation is optional. Any solution that assumes a swap must be performed gives the wrong result.
Consider:
⟦PROTECT_1⟧
The initial beauty is `0`. After swapping, the beauty becomes `2`. The answer is `2`. A solution that only checks whether intervals overlap would miss that a beneficial swap exists even though both original intervals have length zero.
Another subtle case is when intervals are already disjoint:
⟦PROTECT_2⟧
The beauty is `4 + 4 = 8`. Any swap leaves it unchanged. The answer remains `8`. A careless derivation may incorrectly assume that every pair of non-overlapping intervals allows a gain.
## Approaches
The brute-force idea is straightforward. Compute the current beauty. For every pair `(i,j)`, swap `b_i` and `b_j`, recompute the change in contribution of those two positions, and keep the best result.
This works because a swap affects only positions `i` and `j`. Instead of recomputing the whole sum, we can evaluate a pair in constant time. Even then, there are `O(n²)` candidate pairs. With `n = 2·10^5`, that means roughly twenty billion pairs, which is completely infeasible.
The key observation is that each position can be represented by the interval
$$[l_i,r_i]$$
where
$$l_i=\min(a_i,b_i),\qquad r_i=\max(a_i,b_i)。$$
Let
$$S=\sum (r_i-l_i)$$
be the original beauty.
Suppose we swap values between positions `i` and `j`. The only thing that changes is the combined contribution of those two positions.
A very useful identity is:
$$|x-v|+|u-y|
 -
 (|x-y|+|u-v|)
 =
 2\cdot \max(0,\; \text{间隙})$$
where the gap is the distance between the two intervals.
After working through the geometry of absolute values, the maximum gain obtainable from swapping two positions depends only on the intervals. If two intervals overlap, no swap can improve their total contribution. If they are disjoint, the best gain equals twice the distance between them.
For intervals
$$[l_i,r_i],\quad [l_j,r_j]$$
with `r_i < l_j`, the gain is
$$2(l_j-r_i)。$$
So the entire problem becomes:
Find two intervals whose separation
$$l_j-r_i$$
is as large as possible.
Equivalently, among all intervals we want the largest possible value of
$$\max l_i - \min r_i$$
taken from different intervals in the correct order.
A cleaner global interpretation emerges. Let
$$L=\max l_i,\qquad R=\min r_i。$$
If all intervals intersect, then `L ≤ R` and no improvement is possible.
If they do not all intersect, then `L > R`. The maximum achievable gain is
$$2（左-右）。$$
Why? The interval achieving `L` lies completely to the right of the interval achieving `R`, and their separation is exactly `L-R`. No pair of intervals can have a larger gap than that.
Thus the answer is simply
$$S + 2\max(0,L-R)。$$
| Approach | Time Complexity | Space Complexity | Verdict |
| --- | --- | --- | --- |
| Brute Force | O(n²) | O(1) | Too slow |
| Optimal | O(n) | O(1) | Accepted |
## Algorithm Walkthrough
1. Initialize `base = 0`.
2. For every position `i`, compute:
$$l_i=\min(a_i,b_i)$$
and
$$r_i=\max(a_i,b_i)。$$
Add `r_i - l_i` to `base`. This is exactly the original beauty contribution of that position.
3. Track:
$$L=\max l_i$$
and
$$R=\min r_i。$$
These summarize how all intervals relate to each other.
4. If `L ≤ R`, every interval shares a common intersection point. No swap can increase the beauty, so the answer is `base`.
5. Otherwise the intervals have a positive separation of `L - R`. The best possible gain is:
$$2（左-右）。$$
6. Output:
$$基础 + 2(L-R).$$
 ### 为什么它有效
 每个索引贡献一个区间的长度`[l_i,r_i]`。 交换仅影响两个间隔。 对于任何对，总贡献的最大增量等于这些间隔之间距离的两倍，并且当它们重叠时等于零。 
通过取具有最大左端点的间隔和具有最小右端点的间隔来获得两个间隔之间的最大可能距离。 他们的分离是`L-R`每当`L>R`。 没有其他对可以相距更远，因为每个左端点最多`L`每个右端点至少是`R`。 
既然原来的美丽是`base`最好的额外增益正是`2·max(0,L-R)`，该公式始终会产生最佳答案。 
## Python 解决方案```python
import sys
input = sys.stdin.readline
def solve():
    t = int(input())
    ans = []
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))
        base = 0
        max_l = 0
        min_r = 10**18
        for x, y in zip(a, b):
            l = min(x, y)
            r = max(x, y)
            base += r - l
            max_l = max(max_l, l)
            min_r = min(min_r, r)
        gain = max(0, max_l - min_r) * 2
        ans.append(str(base + gain))
    sys.stdout.write("\n".join(ans))
solve()
```第一个循环计算每对对应的间隔`(a_i,b_i)`。 原来的美只是区间长度的总和，所以`base`积累`r - l`。 
同时我们维护最大的左端点和最小的右端点。 这些是确定最大可能改进所需的唯一全局值。 
表达式```
max(0, max_l - min_r)
```计算间隔间隔。 当所有区间重叠时，`max_l <= min_r`并且增益自动变为零。 
所有算术都是用Python整数完成的，因此即使值可以达到，也不存在溢出风险`10^9`总和可以超过`32-bit`限制。 
## 工作示例
 ### 示例 1```
a = [1, 2]
b = [1, 2]
```| 我| 我| r | i 之后的基数 | 最大_l | 分钟_r |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 1 | 0 | 1 | 1 |
 | 2 | 2 | 2 | 0 | 2 | 1 |
 处理完所有区间后：
 | 变量| 价值|
 | --- | --- |
 | 基地| 0 |
 | 最大_l | 2 |
 | 分钟_r | 1 |
 | 增益| 2 |
 | 答案| 2 |
 间隔`[1,1]`和`[2,2]`与距离脱节`1`。 增益为`2`，这与交换两个元素的效果相匹配。 
### 示例 2```
a = [1, 2, 3, 4]
b = [5, 6, 7, 8]
```| 我| 我| r | i 之后的基数 | 最大_l | 分钟_r |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 5 | 4 | 1 | 5 |
 | 2 | 2 | 6 | 8 | 2 | 5 |
 | 3 | 3 | 7 | 12 | 12 3 | 5 |
 | 4 | 4 | 8 | 16 | 16 4 | 5 |
 最终值：
 | 变量| 价值|
 | --- | --- |
 | 基地| 16 | 16
 | 最大_l | 4 |
 | 分钟_r | 5 |
 | 增益| 0 |
 | 答案| 16 | 16
 所有区间相交，因为`max_l <= min_r`。 没有任何交换可以改善美观，因此原始值仍然是最佳的。 
这些痕迹说明了中心不变量：答案仅取决于原始美感和间隔的重叠结构。 
## 复杂度分析
 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个元素被处理一次 |
 | 空间| O(1) | O(1) | 仅存储少量运行变量 |
 | 所有测试总计 | O(Σn) | 所有长度之和最多为`2·10^5`|
 该解决方案对每个测试用例执行一次线性扫描。 由于所有测试用例的元素总数受以下限制`2·10^5`，运行时间很容易满足限制，并且恒定的内存使用量远低于内存上限。 
## 测试用例```python
# helper: run solution on input string, return output string
import sys, io
def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    def solve():
        input = sys.stdin.readline
        t = int(input())
        ans = []
        for _ in range(t):
            n = int(input())
            a = list(map(int, input().split()))
            b = list(map(int, input().split()))
            base = 0
            max_l = 0
            min_r = 10**18
            for x, y in zip(a, b):
                l = min(x, y)
                r = max(x, y)
                base += r - l
                max_l = max(max_l, l)
                min_r = min(min_r, r)
            ans.append(str(base + 2 * max(0, max_l - min_r)))
        print("\n".join(ans))
    solve()
    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return out.getvalue().strip()
# provided sample
assert run("""6
3
1 3 5
3 3 3
2
1 2
1 2
2
1 2
2 1
4
1 2 3 4
5 6 7 8
10
1 8 2 5 3 5 3 1 1 3
2 9 2 4 8 2 3 5 3 1
3
47326 6958 358653
3587 35863 59474
""") == """4
2
2
16
31
419045"""
# minimum size
assert run("""1
2
1 2
1 2
""") == "2"
# already optimal without swap
assert run("""1
2
1 2
2 1
""") == "2"
# all intervals overlap
assert run("""1
3
1 5 3
4 2 6
""") == "9"
# large separation
assert run("""1
2
1 100
1 100
""") == "198"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`a=[1,2], b=[1,2]`|`2`| 最小规模和有利的互换|
 |`a=[1,2], b=[2,1]`|`2`| 可选互换，答案或许是原创之美 |
 | 重叠间隔示例 |`9`| 当间隔相交时增益必须为零 |
 |`a=[1,100], b=[1,100]`|`198`| 大间隔分离和增益计算|
 ## 边缘情况
 考虑：```
1
2
1 2
2 1
```间隔是`[1,2]`和`[1,2]`。 
我们得到：```
base = 2
max_l = 1
min_r = 2
```自从`max_l <= min_r`，增益为零，答案为`2`。 交换实际上会降低美观度，但该操作是可选的，因此算法正确地保留了原始值。 
考虑：```
1
2
1 2
1 2
```间隔是`[1,1]`和`[2,2]`。 
我们得到：```
base = 0
max_l = 2
min_r = 1
```分离是`1`，产生增益`2`。 答案就变成了`2`，完全符合交换后的美感。 
考虑：```
1
2
1 2
5 6
```间隔是`[1,5]`和`[2,6]`。 
我们计算：```
base = 8
max_l = 2
min_r = 5
```自从`max_l <= min_r`，增益为零，答案仍然存在`8`。 间隔重叠，因此任何交换都不会产生额外的距离。 该公式会自动捕获这一点。
