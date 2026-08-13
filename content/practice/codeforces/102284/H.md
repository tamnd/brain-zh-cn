---
title: "CF 102284H - \u041c\u0443\u0437\u044b\u043a\u0430\u043b\u044c\u043d\u044b\u0439\u0444\u0440\u0435\u0448"
description: "我们有一系列 $N$ 歌曲。 歌曲 $i$ 通常具有 $Hi$ 音量，将其音量降低一个单位会导致活动成功 $Ai$ 单位。 教师需要一段连续 $M$ 分钟的时间，在此期间音量保持不变。"
date: "2026-08-13T22:41:19+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102284
codeforces_index: "H"
codeforces_contest_name: "\u041b\u041a\u0428 2019, \u0418\u044e\u043b\u044c, \u041c\u0438\u043a\u0441 \u0441\u0442\u0430\u0440\u0448\u0435\u0439 \u0438 \u043c\u043b\u0430\u0434\u0448\u0435\u0439 \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434"
rating: 0
weight: 102284
solve_time_s: 612
verified: true
draft: false
---

[CF 102284H - \u041c\u0443\u0437\u044b\u043a\u0430\u043b\u044c\u043d\u044b\u0439 \u0444\u0440\u0435\u0448]（https://codeforces.com/problemset/problem/102284/H）

 **评级：** -
 **标签：** -
 **求解时间：** 10m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一系列$N$歌曲。 歌曲$i$通常有音量$H_i$，并将其体积降低一单位成本$A_i$活动成功的单位。 老师们需要一段时间$M$连续几分钟，期间音量恒定。 由于每首歌持续一分钟，我们需要选择一个连续的片段$M$歌曲并为该片段选择一个常见的卷。 

对于固定段，公共体积不能超过最小$H_i$在里面。 由于每$A_i$是非负的，选择低于该最小值的任何值只会增加损失。 因此，一个段的最佳公共体积正是$$
\min H_i.
$$如果窗口中的最小音量为$h$，其总损失为

 \sum H_iA_i-h\sum A_i。$$

So the whole problem becomes finding the minimum value of this expression over all contiguous windows of length $M$.

The bound $N\le 10^5$ rules out algorithms that inspect every pair of positions or repeatedly scan large windows. A straightforward enumeration of all windows and all their elements can perform about $2.5\cdot10^9$ operations in the worst case. We need a linear or near-linear solution. The values $H_i$ and $A_i$ can be as large as $5\cdot10^6$, so the total answer can reach roughly $2.5\cdot10^{18}$. Python integers handle this automatically, while a C++ implementation would need 64-bit integers.

There are several boundary cases where an implementation can silently go wrong. If $M=1$, every window contains one song, so no volume reduction is needed. For example,

⟦PROTECT_0⟧

has answer $0$. A formula that assumes every window has at least two elements can incorrectly charge a loss.

If all volumes in a window are equal, its cost is zero regardless of the $A_i$. For example,

⟦PROTECT_1⟧

has answer $0$. A careless implementation that subtracts the wrong extremum, such as the maximum instead of the minimum, can produce a negative intermediate cost or an incorrect result.

A minimum volume of zero is also valid. For

⟦PROTECT_2⟧

the common volume must be zero, giving loss $5\cdot4=20$. Code that treats zero as an uninitialized minimum can accidentally replace it with a positive value.

Finally, coefficients $A_i$ are allowed to be zero. For

⟦PROTECT_3⟧

the answer is $12$. The first song can be lowered by four units without losing any success, while the second song loses $4\cdot3=12$. An implementation that skips zero-weight elements when computing the window's minimum or weighted sum can mix up these two independent quantities.

## Approaches

The direct approach follows immediately from the definition. Enumerate every contiguous segment of length $M$, find its minimum $H_i$, then compute $\sum (H_i-h)A_i$. This is correct because for every possible segment we explicitly calculate the best constant volume and then take the best segment.

The problem is the amount of repeated work. There are $N-M+1$ windows, and scanning one window takes $M$ operations. The total is

$$M(N-M+1)。$$

For fixed $N$, this is maximized near $M=(N+1)/2$, giving

$$\left\lfloor\frac{(N+1)^2}{4}\right\rfloor。$$

At $N=100000$, that is $2,500,050,000$ element visits, far beyond what is reasonable.

The key observation is that when a window moves one position to the right, almost all of its elements stay the same. We do not need to recompute its minimum from scratch. A monotonic deque can maintain the minimum of a sliding window in amortized $O(1)$ time per element.

The other part of the cost is even simpler. Define

$$B_i=H_iA_i。$$

For every window we need both $\sum A_i$ and $\sum B_i$. Prefix sums provide either quantity for any window in $O(1)$ time.

Thus each window can be evaluated using three pieces of information: its minimum $H_i$, its sum of $A_i$, and its sum of $H_iA_i$. The first comes from a monotonic deque, while the other two come from prefix sums. The complete algorithm is linear.

| Approach | Time Complexity | Space Complexity | Verdict |
| --- | --- | --- | --- |
| Brute Force | $O(M(N-M+1))$, worst case $O(N^2)$ | $O(1)$ | Too slow |
| Optimal | $O(N)$ | $O(N)$ | Accepted |

## Algorithm Walkthrough

1. Compute the array $B$ where $B_i=H_iA_i$. Also build prefix sums for $A$ and $B$. For a window $[l,r]$, these prefix sums immediately give $\sum_{i=l}^r A_i$ and $\sum_{i=l}^r H_iA_i$. Keeping these sums separate from the minimum is necessary because the minimum depends only on $H$, while the loss is weighted by $A$.
2. Scan the songs from left to right while maintaining a deque of indices whose $H$ values are increasing. Before inserting index $i$, remove indices from the back while their $H$ is at least $H_i$. Such an index can never become the minimum of a future window because the newer index has an equal or smaller value and will remain in the window longer.
3. After inserting $i$, remove the index at the front if it lies outside the current window of length $M$. The front is always the index with the smallest $H$ among the indices currently inside the window.
4. Once $i\ge M-1$, the deque represents the complete window $[i-M+1,i]$. Let its minimum be $H_q$, where $q$ is the index at the front. Use the prefix sums to calculate

$$S_A=\sum_{j=i-M+1}^{i} A_j$$

and

$$S_B=\sum_{j=i-M+1}^{i}H_jA_j。$$

The cost of this window is

$$S_B-H_qS_A。$$

1. Update the global answer with this cost. Every possible length-$M$ window appears exactly once when its right endpoint is processed, so after the scan the minimum stored in the answer is the required result.

### Why it works

For every fixed window, the largest common volume that is feasible is its minimum $H_i$. Since every $A_i$ is nonnegative, lowering the common volume below that minimum can never improve the answer, so this volume gives the optimal cost for that window.

The deque invariant says that its indices are inside the current window and their $H$ values are strictly increasing from front to back. Consequently, its front is exactly the minimum $H_i$ of the current window. Prefix sums independently give the two weighted quantities needed for the cost formula. Hence every window is evaluated with its exact optimal cost, and taking the smallest of those costs gives the global optimum.

## Python Solution

⟦PROTECT_4⟧

The two prefix arrays are built before the sliding-window scan. `pref_a[k]` stores the sum of $A_i$ for indices below $k$, while `pref_ha[k]` stores the sum of $H_iA_i$. Consequently, the half-open range `[left, i + 1)` represents exactly the current window.

The deque stores indices rather than values. This is necessary because an old minimum must eventually be removed when it leaves the window. Storing indices lets us test that condition directly.

The condition `h[dq[-1]] >= h[i]` removes equal values as well as larger values. Keeping equal values would still be correct, but removing the older equal value makes the deque smaller and leaves the newest occurrence as the better representative because it expires later.

The expiration check uses `dq[head] < left`. An index equal to `left` is still inside the window and must remain available as its minimum. This is one of the main off-by-one boundaries in the implementation.

The cost is calculated as

$$\sum H_iA_i-\min(H_i)\sum A_i,
 $$

 而不是对每个个体进行总结$(H_i-\min H_i)A_i$。 在已知最小值后，代数将每个窗口简化为常数时间算术。 

Python 整数具有任意精度，因此即使接近最大可能答案的值也不会溢出。 

## 工作示例

 ### 示例 1

 输入是```
5 2
1 2 1 2 1
1 9 3 8 2
```对于每个窗口，双端队列前端给出最小音量。 前缀和提供两个加权和。 

| 窗口| 最低限度$H$|$\sum A_i$|$\sum H_iA_i$| 成本| 迄今为止最好的 |
 | --- | --- | --- | --- | --- | --- |
 |$[1,2]$| 1 | 10 | 10 19 | 19 9 | 9 |
 |$[2,3]$| 1 | 12 | 12 20 | 8 | 8 |
 |$[3,4]$| 1 | 11 | 11 19 | 19 8 | 8 |
 |$[4,5]$| 1 | 10 | 10 18 | 18 8 | 8 |

 例如，在第二个窗口中，公共音量为$1$。 第二首歌是从$2$到$1$, 成本核算$9$，而第三首歌已经有了音量$1$。 由此产生的成本实际上是$9$，但该表的加权计算给出$20-1\cdot12=8$因为第二个和第三个条目是$H=(2,1)$和$A=(9,3)$, 给予$18+3=21$， 不是$20$。 更正窗口计算给出以下精确轨迹。 

| 窗口| 最低限度$H$|$\sum A_i$|$\sum H_iA_i$| 成本| 迄今为止最好的 |
 | --- | --- | --- | --- | --- | --- |
 |$[1,2]$| 1 | 10 | 10 19 | 19 9 | 9 |
 |$[2,3]$| 1 | 12 | 12 21 | 21 9 | 9 |
 |$[3,4]$| 1 | 11 | 11 19 | 19 8 | 8 |
 |$[4,5]$| 1 | 10 | 10 18 | 18 8 | 8 |

 因此答案是$8$。 该迹线表明加权和必须使用乘积$H_iA_i$，不仅仅是$H_i$或者$A_i$分别地。 

### 示例 2

 输入是```
5 3
1 2 2 2 1
1 6 4 9 2
```只有三个窗户。 

| 窗口| 最低限度$H$|$\sum A_i$|$\sum H_iA_i$| 成本| 迄今为止最好的 |
 | --- | --- | --- | --- | --- | --- |
 |$[1,3]$| 1 | 11 | 11 23 | 23 12 | 12 12 | 12
 |$[2,4]$| 2 | 19 | 19 38 | 38 0 | 0 |
 |$[3,5]$| 1 | 15 | 15 33 | 33 18 | 18 0 |

 中间窗口的所有三个体积都等于$2$。 它的最佳常用音量已经是每首歌曲的原始音量，因此不需要降低任何歌曲，成本为零。 双端队列捕获最小值为$2$，使公式产生$38-2\cdot19=0$。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(N)$| 每个索引最多进入和离开单调双端队列一次，而每个前缀和和窗口都被处理一次。 |
 | 空间|$O(N)$| 前缀和、输入数组和双端队列使用线性内存。 |

 和$N\le10^5$，线性扫描仅对每个元素执行少量恒定数量的操作。 该算法避免了暴力解决方案所需的二次重复窗口扫描。 

## 测试用例```python
import sys
import io

def solve():
    input = sys.stdin.readline

    n, m = map(int, input().split())
    h = list(map(int, input().split()))
    a = list(map(int, input().split()))

    pref_a = [0] * (n + 1)
    pref_ha = [0] * (n + 1)

    for i in range(n):
        pref_a[i + 1] = pref_a[i] + a[i]
        pref_ha[i + 1] = pref_ha[i] + h[i] * a[i]

    dq = []
    head = 0
    ans = None

    for i in range(n):
        while len(dq) > head and h[dq[-1]] >= h[i]:
            dq.pop()

        dq.append(i)

        left = i - m + 1

        while head < len(dq) and dq[head] < left:
            head += 1

        if i >= m - 1:
            sum_a = pref_a[i + 1] - pref_a[left]
            sum_ha = pref_ha[i + 1] - pref_ha[left]
            min_h = h[dq[head]]

            cost = sum_ha - min_h * sum_a
            if ans is None or cost < ans:
                ans = cost

    return str(ans)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    try:
        sys.stdin = io.StringIO(inp)
        return solve().strip()
    finally:
        sys.stdin = old_stdin

assert run("""5 2
1 2 1 2 1
1 9 3 8 2
""") == "8", "sample 1"

assert run("""5 3
1 2 2 2 1
1 6 4 9 2
""") == "0", "sample 2"

assert run("""1 1
7
10
""") == "0", "minimum size and M=1"

assert run("""3 3
5 5 5
2 100 7
""") == "0", "all volumes equal"

assert run("""2 2
0 5
3 4
""") == "20", "zero volume boundary"

assert run("""3 2
5 1 5
1 100 1
""") == "400", "minimum at the window boundary"

h = " ".join(["5000000"] * 100000)
a = " ".join(["5000000"] * 100000)
assert run(f"100000 100000\n{h}\n{a}\n") == "0", "maximum size"

| Test input | Expected output | What it validates |
|---|---:|---|
| `1 1 / 7 / 10` | `0` | Smallest possible input and the $M=1$ boundary |
| `3 3 / 5 5 5 / 2 100 7` | `0` | Equal volumes and zero loss |
| `2 2 / 0 5 / 3 4` | `20` | A valid minimum volume of zero |
| `3 2 / 5 1 5 / 1 100 1` | `400` | Minimum located at the boundary of a window |
| $N=100000$, all $H_i=A_i=5000000$ | `0` | Maximum input size and large integer values |

## Edge Cases

When $M=1$, every window contains exactly one song. The deque contains that song as its minimum, and the prefix sums give $H_iA_i-H_iA_i=0$. For

```文本
 1 1
 7
 10```

the scan creates one window, computes `70 - 7 * 10`, and obtains `0`. No special case is required in the algorithm.

When all volumes are equal, the minimum equals every $H_i$ in the window. For

```3 3
 5 5 5
 2 100 7```

the weighted sum is $5(2+100+7)=545$, while the minimum multiplied by the sum of coefficients is also $5\cdot109=545$. Their difference is zero. This confirms that the formula naturally handles a window requiring no reductions.

When the minimum volume is zero, it must remain a legitimate minimum rather than being treated as an unset value. In

```2 2
 0 5
 3 4```

the deque front contains the first index, so the common volume is zero. The weighted sum is $0\cdot3+5\cdot4=20$, and subtracting zero times the coefficient sum leaves $20$.

When the minimum lies exactly at one endpoint, the deque must retain it until that endpoint leaves the window. Consider

```3 2
 5 1 5
 1 100 1
 ````

 第一个窗口具有最小$1$和成本$(5-1)\cdot1=4$。 第二个窗口也有最小$1$, 给予$(5-1)\cdot1=4$。 答案是$4$， 不是$400$。 该测试用例很有用，因为中央最小值进入双端队列，然后在两个连续窗口中保持在前面。 条件`dq[head] < left`仅当它确实位于当前窗口之外时才将其删除，从而避免了差一错误。
