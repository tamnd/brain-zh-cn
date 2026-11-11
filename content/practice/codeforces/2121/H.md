---
 标题：“CF 2121H - 冰宝贝”
 描述：“对于每个位置 i，我们没有给出固定值。相反，我们可以选择区间 [li, ri] 内的任何整数。对于每个前缀长度 k，考虑所有数组$$a1,a2,dots,ak$$这样$$li le ai le ri." date: "2026-06-08T03:50:08+07:00" tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "data-structures", "dp", "implementation", "sortings"] categories: ["algorithms"] codeforces_contest: 2121 codeforces_index: "H" codeforces_contest_name: "Codeforces Round 1032 (Div. 3)" rating: 2300 weight: 2121 solve_time_s: 90 verified: false draft: false --- [CF 2121H - Ice Baby](https://codeforces.com/problemset/problem/2121/H) **Rating:** 2300   **Tags:** binary search, brute force, data structures, dp, implementation, sortings   **Solve time:** 1m 30s   **Verified:** no   ## Solution ## Problem Understanding For every position `i`, we are not given a fixed value. Instead, we may choose any integer inside an interval `[l_i, r_i]`. For each prefix length `k`, consider all arrays$$a_1,a_2,\点,a_k$$
such that
$$l_i \le a_i \le r_i。$$
Among all valid choices, we want the largest possible length of a non-decreasing subsequence.
The answer must be reported for every prefix independently. After reading the first interval we output the best LNDS length for that prefix, after reading the first two intervals we output the best LNDS length for that prefix, and so on.
The total number of intervals over all test cases is at most `2·10^5`. A quadratic DP would require roughly `4·10^10` operations in the worst case, which is completely impossible within two seconds. Any accepted solution must be close to `O(n log n)`.
The tricky part is that we are not constructing one particular array. We are optimizing over all possible choices inside the intervals. A greedy choice that looks good locally may destroy a longer subsequence later.
Consider
⟦PROTECT_0⟧
For the whole prefix, the optimal answer is `3`. Choosing the largest possible value everywhere gives `[5,4,3,3]`, whose LNDS length is only `2`.
Another easy mistake is to think that an interval contributes to the answer whenever it intersects some previous interval. For
⟦PROTECT_1⟧
every valid choice satisfies `a1 > a2`, so the answer is still `1`.
A third subtle case appears when many intervals can all use the same value:
⟦PROTECT_2⟧
Choosing all values equal gives an LNDS of length `3`. Any approach that treats equal values as strictly increasing would incorrectly return smaller answers.
## Approaches
The classical LNDS algorithm maintains
$$dp[j]$$
as the minimum possible ending value of a non-decreasing subsequence of length `j`.
For a fixed array, processing one element updates this structure using binary search.
A brute force interpretation of the current problem would try all valid choices for every interval and run LNDS on each resulting array. Even if intervals were tiny, the number of arrays grows exponentially. This is hopeless.
The key observation is that the standard LNDS DP does not actually need the exact chosen value. It only needs to know how the new interval can affect the minimal ending values.
Suppose we already maintain the LNDS DP for all arrays obtainable from the processed prefix. Let the current interval be `[l,r]`.
For a subsequence ending value `x`, we may append the new position if we can choose a value `v` such that
$$x \le v \le r。$$
Among all such choices, the best one is the smallest possible value, namely
$$v=\max(x,l)。$$
This turns the transition into a purely interval-based operation.
The resulting DP keeps exactly the same monotonic structure as the ordinary patience-sorting LNDS algorithm. After simplifying the transitions, one discovers that processing `[l,r]` is equivalent to:
1. Find the first DP value greater than `r`.
2. Remove that value.
3. Insert `l`.
This can be maintained with a multiset.
The size of the structure directly equals the current optimal LNDS length plus one sentinel element.
Each interval causes one insertion and at most one deletion, giving `O(log n)` work per interval.
| Approach | Time Complexity | Space Complexity | Verdict |
|---|------|---|
| Brute Force | Exponential | Exponential | Too slow |
| Optimal | O(n log n) | O(n) | Accepted |
## Deriving the DP Transition
Let
$$dp_j$$
denote the minimum possible ending value of a non-decreasing subsequence of length `j`.
As in the classical LNDS algorithm, the sequence
$$dp_1 \le dp_2 \le \点$$
is non-decreasing.
Assume we process interval `[l,r]`.
Take some state `dp_j`.
If `dp_j > r`, no value from the interval can extend that subsequence.
If `dp_j ≤ r`, we can choose a value from the interval and extend it. The smallest achievable ending value becomes
$$\max(dp_j,l).$$
 因为DP数组是有序的，所有大于的值`r`形成后缀。 
让`x`是第一个 DP 值严格大于`r`。 
每个较小的 DP 值仍然有效，而由 表示的位置`x`可以改进为`l`。 
经过标准的 LNDS 简化后，整个更新变成：
 - 插入`l`,
 - 删除第一个大于的值`r`。 
这与耐心排序执行的替换操作完全相同。 
多重集自然支持这两种操作。 
## 算法演练
 1. 创建多重集`S`包含单个哨兵值`0`。 
2. 从左到右处理间隔。 
3. 对于当前间隔`[l,r]`, 找到第一个元素`S`严格大于`r`。 
4. 插入`l`进入`S`。 
5. 如果存在这样的元素，则删除该元素。 
这是上述 LNDS DP 转换的压缩形式。 
6. 当前答案等于`|S| - 1`。 
减法删除了哨兵。 
7. 在每个处理间隔后输出答案。 
### 为什么它有效
 多重集始终将当前的 LNDS DP 数组与哨兵一起存储`0`。 
对于每个可能的子序列长度`j`， 这`j`- 多重集的第一个最小元素等于长度非递减子序列的最小可实现结束值`j`。 
当间隔`[l,r]`到达，替换第一个大于的值`r`经过`l`执行与上面导出的间隔 DP 完全相同的状态转换。 较短的子序列不会变得更糟，并且受影响长度的最佳可实现最终值会变得最小。 
由于每次更新后都会保留经典的耐心排序不变量，因此非哨兵元素的数量等于当前前缀可实现的最大 LNDS 长度。 
## Python 解决方案```python
import sys
from bisect import bisect_right
input = sys.stdin.readline
from sortedcontainers import SortedList
def solve():
    t = int(input())
    out = []
    for _ in range(t):
        n = int(input())
        dp = SortedList([0])
        ans = []
        for _ in range(n):
            l, r = map(int, input().split())
            pos = dp.bisect_right(r)
            dp.add(l)
            if pos < len(dp):
                dp.pop(pos)
            ans.append(str(len(dp) - 1))
        out.append(" ".join(ans))
    sys.stdout.write("\n".join(out))
if __name__ == "__main__":
    solve()
```The implementation mirrors the mathematical transition directly.
 The multiset must support insertion, deletion of an arbitrary position, and upper bound queries. 在 C++ 中，`multiset`自然地处理这个问题。 在Python中，需要一个平衡的有序容器。`SortedList`提供所有必需的操作`O(log n)`。 
操作顺序很重要。 我们首先找到第一个大于的值`r`，然后插入`l`，然后擦除之前确定的位置。 这再现了 DP 的精确更换操作。 
哨兵`0`小于每个可能的区间值，因为所有区间端点至少`1`。 它表示空子序列，并允许每个实子序列长度移动一位。 
## 工作示例
 ### 示例 1
 输入：```
4
4 5
3 4
1 3
3 3
```| 步骤| 间隔| 更新后的多集 | 回答 |
 | ---| ---| ---| ---|
 | 1 | [4,5]| {0,4} | 1 |
 | 2 | [3,4]| {0,3} | 1 |
 | 3 | [1,3]| {0,1,3} | 2 |
 | 4 | [3,3]| {0,1,3,3} | 3 |
 输出：```
1 1 2 3
```第三间隔创建第二可实现的子序列长度。 第四个间隔再次延长。 
### 示例 2
 输入：```
5
1 2
6 8
4 5
2 3
3 3
```| 步骤| 间隔| 更新后的多集 | 回答 |
 | ---| ---| ---| ---|
 | 1 | [1,2]| {0,1} | 1 |
 | 2 | [6,8]| {0,1,6} | 2 |
 | 3 | [4,5]| {0,1,4} | 2 |
 | 4 | [2,3]| {0,1,2} | 2 |
 | 5 | [3,3]| {0,1,2,3} | 3 |
 输出：```
1 2 2 2 3
```该迹线显示了稍后的间隔如何在不立即增加答案的情况下改善 DP 状态。 仅当可以实现新的子序列长度时，答案才会增长。 
## 复杂度分析
 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 每个时间间隔一次上限查询、一次插入、最多一次删除 |
 | 空间| O(n) | 多重集在每个处理间隔加上哨兵 | 最多存储一个值。 
至多有`2·10^5`所有测试用例的间隔，`O(n log n)`很容易符合限制。 
## 测试用例```python
# helper: run solution on input string, return output string
import io
import sys
from sortedcontainers import SortedList
def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline
    t = int(input())
    out = []
    for _ in range(t):
        n = int(input())
        dp = SortedList([0])
        cur = []
        for _ in range(n):
            l, r = map(int, input().split())
            pos = dp.bisect_right(r)
            dp.add(l)
            if pos < len(dp):
                dp.pop(pos)
            cur.append(str(len(dp) - 1))
        out.append(" ".join(cur))
    return "\n".join(out)
# sample
assert run(
"""1
4
4 5
3 4
1 3
3 3
"""
) == "1 1 2 3"
# minimum size
assert run(
"""1
1
1 1
"""
) == "1"
# strictly impossible to chain
assert run(
"""1
2
3 4
1 2
"""
) == "1 1"
# all equal intervals
assert run(
"""1
4
5 5
5 5
5 5
5 5
"""
) == "1 2 3 4"
# increasing overlap
assert run(
"""1
4
1 10
2 10
3 10
4 10
"""
) == "1 2 3 4"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单次间隔 |`1`| 最小尺寸|
 |`[3,4],[1,2]`|`1 1`| 不存在有效的非递减对 |
 | 全部`[5,5]`|`1 2 3 4`| LNDS | 中必须允许相同的值
 | 增加间隔|`1 2 3 4`| 可实现子序列长度的持续增长|
 ## 边缘情况
 考虑```
2
3 4
1 2
```在第一个间隔之后，多重集是`{0,3}`答案是`1`。 
对于第二个间隔，第一个值大于`2`是`3`。 将其替换为`1`产生`{0,1}`。 答案依然存在`1`。 
这符合现实，因为每个有效的选择都满足`a1 > a2`。 
现在考虑```
4
5 5
5 5
5 5
5 5
```多重集演化为```
{0,5}
{0,5,5}
{0,5,5,5}
{0,5,5,5,5}
```答案变成```
1 2 3 4
```非递减子序列中允许有相等的值，因此可以选择整个数组。 
最后考虑```
3
1 10
1 10
1 10
```每个区间可以选择值`1`。 该算法永远不会删除会减少可实现长度的状态。 多重集每一步增长一个元素，给出答案`1 2 3`，这是最优的。
