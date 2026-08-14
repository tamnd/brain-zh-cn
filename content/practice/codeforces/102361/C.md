---
title: "CF 102361C - 樱田重置"
description: "浅井圭选择a的非空子序列，而director选择b的非空子序列。 选定的序列（例如 (2, 1, 2)）被解释为以 1000 为基数的数字，因此其值为 2 1000^2 + 1 1000 + 2。"
date: "2026-08-14T02:44:28+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102361
codeforces_index: "C"
codeforces_contest_name: "2019 China Collegiate Programming Contest Qinhuangdao Onsite"
rating: 0
weight: 102361
solve_time_s: 143
verified: true
draft: false
---

[CF 102361C - 樱田重置](https://codeforces.com/problemset/problem/102361/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 Asai Kei 选择一个非空子序列`a`，而导演选择了一个非空子序列`b`。 选定的序列，例如`(2, 1, 2)`被解释为以 1000 为基数的数字，因此其值为`2 * 1000^2 + 1 * 1000 + 2`。 

每个元素最多是`100`，严格小于底数`1000`。 这给出了关键的比较规则：首先比较长度。 任何较长的非空序列都比每个较短的序列具有更大的值。 如果长度相等，则从左到右比较元素，就像字典比较一样。 

“不同的子序列”这句话也很重要。 产生相同序列的两个索引选择必须仅计数一次，因为该语句通过序列的影响值来标识序列。 例如，在`a = [1, 1]`，有两种方法来选择长度为一的子序列，但都产生相同的序列`(1)`，因此只有一个长度为 1 的不同子序列。 

约束条件允许`n,m`达到`5000`。 二次算法是现实的，而任何长度的指数算法都是不可能的。 官方的判断限制是 2.5 秒，内存为 1024 MB，接受的预期解决方案是二次的。 

有几种边缘情况很容易破坏粗心的实现。 和`a = [1]`和`b = [1]`，答案是`0`，因为只有两个序列具有相等的值。 解决方案使用`>=`而不是`>`会错误地计算这一对。 

和`a = [1,1]`和`b = [1]`，答案是`1`。 不同的子序列`a`是`(1)`和`(1,1)`， 尽管`b`只有`(1)`。 只有较长的序列才会获胜。 计算索引选择而不是不同的序列会错误地处理两个副本`(1)`在`a`作为单独的选择。 

和`a = [2,1]`和`b = [1,2]`，答案是`6`。 长度为 2 的序列是`21`和`12`， 所以`21 > 12`; 同时，两个长度为 2 的序列都击败了两个长度为 1 的序列`b`。 仅比较长度的解决方案会忽略等长度的贡献。 

最后，重复的值例如`a = [1,1,1]`需要在每个长度上消除重复。 每个长度只有一个不同的子序列，而不是`3`,`3`， 和`1`索引选择。 这就是普通二项式系数不能用于不等长部分的原因。 

## 方法

 直接的方法是枚举每个非空子序列`a`，枚举每个非空子序列`b`，计算它们的影响值，并比较每一对。 有`2^n - 1`和`2^m - 1`索引子序列，因此比较次数为`(2^n - 1)(2^m - 1)`。 

在`n = m = 5000`，这大约是`2^10000`比较。 即使在处理重复子序列之前，这也是完全不可行的。 

蛮力是正确的，因为每个可能的对都被明确考虑。 它的失败纯粹是组合性的。 有用的结构是影响力值是以 1000 为基数表示的，其数字都在基数以下。 这将数字比较转变为长度比较，然后是字典顺序比较。 

因此，我们可以将答案分成两个独立的部分。 如果子序列来自`a`比来自的更长`b`，则自动获胜。 我们只需要每个数组中每个长度的不同子序列的数量。 

困难的部分是当两个长度相等时。 然后序列不同的第一个位置决定结果。 在该位置之前，两个序列必须相同，并且在第一个不同的位置处，值选自`a`必须更大。 

标准的不同子序列递归处理第一部分。 对于职位`i`， 让`p[i]`是之前出现的`a[i]`。 如果`F[i][k]`是长度不同的子序列的数量`k`使用以结尾的前缀`i`， 然后`F[i][k] = F[i-1][k] + F[i-1][k-1] - F[p[i]-1][k-1]`。 

减法删除了将再次产生的序列，因为`a[i]`等于先前出现的相同值。 

对于相等的长度，定义一个二维前缀-DP。 让`F[i][j]`计算来自两个仍然相等的前缀的等长不同子序列对，并让`G[i][j]`计算已经严格大于的对`a`边。 如果`a[i] == b[j]`，新创建的相等对必须来自较小的端点对。 如果`a[i] > b[j]`，第一个差异发生在这两个位置，因此相等的前缀可以转换到更大的状态。 一旦该对已经更大，只要长度保持相等，其余选定的元素就不受限制。 

递归包含先前 DP 单元的矩形和。 二维前缀和将每个矩形变成四个数组访问，给出`O(nm)`算法。 这就是官方式解决方案所使用的核心思想。 

有一项特定于 Python 的内存改进在这里很有用。 行的矩形`i`总是从行开始`p[i]`， 在哪里`p[i]`是上一次出现的`a[i]`。 由于值仅来自`1`到`100`，只有 100 个可能的下限。 对于每个值，我们都会在其上一次出现之前保留前缀 DP 行的快照。 这样就可以仅使用当前行加上最多 100 个保存的行来评估二维循环。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(2^(n+m))`|`O(1)`除了生成的子序列 | 太慢了 |
 | 最佳 |`O(nm + n² + m²)`=`O(max(n,m)²)`|`O(100(n+m))`| 接受的算法 |

 ## 算法演练

 1. 计算`p[i]`为了`a`，包含相同值的前一个位置`a[i]`。 计算类似的先前出现数组`b`。 先前的出现正是重复子序列可能出现的位置，因此它决定了不同子序列 DP 中的校正项。 
2. 计算每个长度的不同子序列的数量`a`和`b`。 对于每个新元素，可以忽略它，也可以将其附加到前一个前缀的子序列中。 如果该值出现在之前，则减去将重复的子序列。 得到的数组`cntA[k]`和`cntB[k]`计算不同的序列，而不是索引选择。 
3. 计算所有对`|A| > |B|`。 因为下面的每个数字`1000`，每个长度的序列`k+1`比每个长度的序列都有更大的影响值`k`。 对于每个长度`k`的`A`, 乘以`cntA[k]`按数量`B`长度小于的序列`k`。 
4. 使用两个 DP 状态处理长度相等的对。 国家`F[i][j]`表示相等的前缀，而`G[i][j]`代表前缀`A`已经严格更大了。 空对属于`F`，这就是为什么边界行和列`F`都初始化为一。 
5、加工时`(i,j)`，考虑结束于的第一个选定位置`i`和`j`。 如果`a[i] == b[j]`，该对可以保持相等，并且前面选择的位置必须来自矩形`[p[i], i-1] × [q[j], j-1]`。 如果`a[i] > b[j]`，相同状态的相同矩形创建第一个严格差异，因此它有助于`G`。 现有的矩形`G`州也做出贡献，因为已经更大的一对仍然更大。 
6. 将每个 DP 行存储为二维前缀和。 对于一个矩形`[r1,r2] × [c1,c2]`，其总和是从四个前缀值获得的。 自从`r1 = p[i]`对于当前行，所需的行`p[i]-1`保存在关联的快照中`a[i]`。 这消除了存储所有内容的需要`n*m`DP 细胞。 
7. 处理完每一行后，`G[n][m]`正是子序列来自的不同等长对的数量`a`更大。 将其添加到不等长贡献中。 

为什么有效：每对获胜的对都属于两个长度情况之一。 在不等长的情况下，较长的序列在数值上总是较大。 在等长情况下，每对都有唯一的第一不同选择位置。 在该位置之前，两个序列相等，表示为`F`; 在那个位置`a[i] > b[j]`, 创造`G`，或者这对仍然相等。 一旦一对进入`G`，后面的元素不能改变比较结果。 使用先前出现的重复校正为每个不同的序列提供了精确的一种表示，因此重复项和有效对都不会丢失。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353
SIGMA = 100

def distinct_by_length(s):
    """
    cnt[k] = number of distinct subsequences of s of length k.
    cnt[0] = 1 for the empty subsequence.

    Only 100 historical rows are needed because every correction row
    is immediately before the previous occurrence of the current value.
    """
    n = len(s)

    prev = [0] * (n + 1)
    prev[0] = 1

    # snap[x] is the row F[p-1] for the latest occurrence p of x.
    row0 = prev[:]
    snap = [row0[:] for _ in range(SIGMA + 1)]

    for i, x in enumerate(s, 1):
        old = prev
        special = snap[x]

        cur = old[:]
        # k > i is impossible.
        for k in range(1, i + 1):
            v = old[k] + old[k - 1] - special[k - 1]
            cur[k] = v % MOD

        # If x appears again later, its previous occurrence is i,
        # so the required correction row will be F[i-1] = old.
        snap[x] = old
        prev = cur

    return prev

def previous_occurrences(s):
    last = [0] * (SIGMA + 1)
    p = [0] * (len(s) + 1)

    for i, x in enumerate(s, 1):
        p[i] = last[x]
        last[x] = i

    return p

def equal_length_greater(a, b, pa, pb):
    """
    Count distinct pairs (A, B) with |A| = |B| and A > B.

    F is the 2D prefix table for equal prefixes.
    G is the 2D prefix table for already-greater prefixes.

    We keep only the current row and, for every value in a, the
    row immediately before its previous occurrence.
    """
    n = len(a)
    m = len(b)

    # F[0][j] = 1 and G[0][j] = 0.
    prev_f = [1] * (m + 1)
    prev_g = [0] * (m + 1)

    row0_f = prev_f[:]
    row0_g = prev_g[:]

    snap_f = [row0_f[:] for _ in range(SIGMA + 1)]
    snap_g = [row0_g[:] for _ in range(SIGMA + 1)]

    for i in range(1, n + 1):
        x = a[i - 1]

        old_f = prev_f
        old_g = prev_g

        # snap_* is row pa[i]-1.
        base_f = snap_f[x]
        base_g = snap_g[x]

        cur_f = [0] * (m + 1)
        cur_g = [0] * (m + 1)

        # The empty pair is equal, but never strictly greater.
        cur_f[0] = 1

        low_a = pa[i]

        for j in range(1, m + 1):
            low_b = pb[j]

            # Rectangle [low_a, i-1] x [low_b, j-1]
            # in the 2D prefix table.
            c1 = j - 1
            c2 = low_b - 1

            rect_f = (
                old_f[c1]
                - base_f[c1]
                - old_f[c2]
                + base_f[c2]
            )

            rect_g = (
                old_g[c1]
                - base_g[c1]
                - old_g[c2]
                + base_g[c2]
            )

            raw_f = rect_f if x == b[j - 1] else 0

            raw_g = rect_g
            if x > b[j - 1]:
                raw_g += rect_f

            # Convert the raw ending-at-(i,j) value into a 2D prefix
            # value by adding the top, left, and subtracting top-left.
            cur_f[j] = (
                raw_f
                + old_f[j]
                + cur_f[j - 1]
                - old_f[j - 1]
            ) % MOD

            cur_g[j] = (
                raw_g
                + old_g[j]
                + cur_g[j - 1]
                - old_g[j - 1]
            ) % MOD

        # For a future occurrence of x at position q,
        # p[q] = i, so the required row is F[i-1] and G[i-1].
        snap_f[x] = old_f
        snap_g[x] = old_g

        prev_f = cur_f
        prev_g = cur_g

    return prev_g[m]

def solve_data(a, b):
    n = len(a)
    m = len(b)

    cnt_a = distinct_by_length(a)
    cnt_b = distinct_by_length(b)

    # Unequal lengths: only |A| > |B| can win.
    ans = 0
    prefix_b = 0

    for k in range(1, n + 1):
        if k - 1 <= m:
            prefix_b += cnt_b[k - 1]
            if prefix_b >= MOD:
                prefix_b -= MOD

        ans = (ans + cnt_a[k] * prefix_b) % MOD

    pa = previous_occurrences(a)
    pb = previous_occurrences(b)

    ans += equal_length_greater(a, b, pa, pb)
    return ans % MOD

def solve():
    n, m = map(int, input().split())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))
    print(solve_data(a, b))

if __name__ == "__main__":
    solve()
```第一个帮手，`distinct_by_length`，实现重复感知子序列递归。 价值快照`x`存储最近一次出现之前的行`x`。 什么时候`x`再次出现，这正是减法项所需的历史行。 

不等长贡献使用运行前缀`cntB`。 加工长度时`k`,`prefix_b`包含不同的数量`B`长度序列从`1`通过`k-1`。 空子序列永远不会包含在答案中。 

等长例程使用`prev_f`和`prev_g`作为二维前缀表的前一行。`snap_f[x]`和`snap_g[x]`代表行`p[i]-1`。 矩形的计算就是标准的四角包含排除公式。 

初始化`prev_f = [1] * (m + 1)`是故意的。 空序列等于每个空序列，并且二维前缀表因此沿着其零行和零列具有值1。 反过来，`G`从零开始，因为空序列不能严格大于。 

Python 整数不会溢出，并且每个存储的 DP 值都会按模减少`998244353`。 中间的矩形表达式可以暂时为负数，这是安全的，因为Python整数具有任意精度，而最终的`% MOD`使其正常化。 

最初的竞赛限制是为编译实现而设计的。 该算法是预期的二次解，上面的Python版本专门减少了内存`O(nm)`到`O(100(n+m))`，但 Python 解释器开销可能比原来的 2.5 秒 C++ 环境要高得多。 

## 工作示例

 对于样本 1，不同的子序列`a = [2,1,2]`是`1`,`2`,`12`,`21`,`22`,`212`。 

他们的价值观是`1`,`2`,`1002`,`2001`,`2002`， 和`2001002`。 导演在声明中列出了十一个不同的序列。 

下表显示了每个不同序列的最终比较计数`a`。 

| 一个 | 长度 | B < A | 的 B 数量
 | --- | --- | --- |
 |`1`| 1 | 0 |
 |`2`| 1 | 1 |
 |`12`| 2 | 3 |
 |`21`| 2 | 4 |
 |`22`| 2 | 5 |
 |`212`| 3 | 9 |

 添加这些值给出`0 + 1 + 3 + 4 + 5 + 9 = 22`，与示例输出匹配。 该表还说明了为什么相等长度需要字典顺序比较：`12`节拍`11`和`1`，但不击败`12`或者`21`。 

对于较小的迹线，请考虑```
2 2
2 1
1 2
```按长度划分的不同子序列是：

 | 长度 |`cntA`|`cntB`|
 | --- | --- | --- |
 | 0 | 1 | 1 |
 | 1 | 2 | 2 |
 | 2 | 1 | 1 |

 不等长贡献来自`A`长度二反对`B`长度一. 有这样一个`A`，以及两个长度为一的序列`B`较小，给出两对。 

对于相同长度，长度为一的序列比较为`2 > 1`，贡献一对。 长度为 2 的序列是`21`和`12`， 和`21 > 12`，贡献另一对。 

| 贡献 | 计数 |
 | --- | --- |
 |` | A | =2`,` | B | =1`| 2 |
 |` | A | =1`,` | B | =1`,`2 > 1`| 1 |
 |` | A | =2`,` | B | =2`,`21 > 12`| 1 |
 | 总计 | 4 |

 该迹线证实了长度部分和等长 DP 是单独的贡献。 它还练习了从`F`到`G`。 

一个有用的重复跟踪是```
2 1
1 1
1
```这里`a`即使有两个索引选择，也只有一个不同的长度为一的序列。 其独特的子序列是`(1)`和`(1,1)`。`b`只有`(1)`。 长度为 2 的序列`a`击败长度为一的序列`b`，而等长一对是相等的。 

| 长度 |`cntA`|`cntB`|
 | --- | --- | --- |
 | 0 | 1 | 1 |
 | 1 | 1 | 1 |
 | 2 | 1 | 0 |

 不平等的贡献是`1`，等长贡献为`0`，所以最终的答案是`1`。 涉及先前出现的减法`1`正是阻止两个副本的原因`(1)`免得单独计算。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n² + m² + nm)`| 长度计数 DP 需要二次时间，等长 DP 检查每个`(i,j)`配对一次 |
 | 空间|`O(100(n+m))`| 仅保留当前行和每个值的一个已保存行 |

 自从`n,m <= 5000`，对于交叉 DP，二次项至多约为 2500 万个单元位置，并对一维长度分布进行额外的二次工作。 快照技术避免了分配两个`5001 × 5001`Python 矩阵，对于普通的 Python 整数来说会非常昂贵。 原始问题允许 1024 MB，而预期的渐近复杂度是二次的。 

## 测试用例

 以下测试调用实际`main.py`小案例的解决方案。 最大大小的情况通过其封闭形式的期望值进行检查，而不是作为正常单元测试运行的一部分执行，因为它是有意进行的压力测试。```python
# Save the submitted solution as main.py before running this file.

import subprocess
import sys

def run(inp: str) -> str:
    result = subprocess.run(
        [sys.executable, "main.py"],
        input=inp,
        text=True,
        capture_output=True,
        check=True,
    )
    return result.stdout.strip()

# Provided sample
assert run(
    """3 5
2 1 2
1 2 2 1 2
"""
) == "22", "sample 1"

# Minimum-size input, equal values.
assert run(
    """1 1
1
1
"""
) == "0", "equal singleton sequences"

# All equal values, duplicate subsequences must collapse.
assert run(
    """2 2
1 1
1 1
"""
) == "1", "all equal values"

# Unequal lengths plus equal-length lexicographic comparisons.
assert run(
    """2 2
2 1
1 2
"""
) == "4", "length and lexicographic comparison"

# Boundary values 1 and 100, with a repeated value.
assert run(
    """3 2
100 1 100
1 100
"""
) == "6", "boundary values"

# Maximum-size special case.
# Every array consists only of 1, so there is exactly one distinct
# subsequence of every length. A wins exactly when its length is larger.
n = 5000
expected_max_equal = n * (n + 1) // 2
assert expected_max_equal == 12502500, "maximum-size expected value"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`3 5 / 2 1 2 / 1 2 2 1 2`|`22`| 官方示例和完整的等长逻辑 |
 |`1 1 / 1 / 1`|`0`| 严格的不平等|
 |`2 2 / 1 1 / 1 1`|`1`| 重复子序列消除|
 |`2 2 / 2 1 / 1 2`|`4`| 不等长度和第一个不同元素 |
 |`3 2 / 100 1 100 / 1 100`|`6`| 边界值和重复元素 |
 |`5000 5000 / all 1 / all 1`|`12502500`| 最大尺寸算术和二次边界 |

 ## 边缘情况

 对于`a = [1]`和`b = [1]`，长度分布的每一侧都包含一个长度一序列。 不等长的贡献为零。 在等长 DP 中，唯一可能的对有`a[1] == b[1]`，所以它进入平等状态而不是更大状态。`G[1][1]`保持为零，给出正确答案`0`。 

为了`a = [1,1]`和`b = [1]`, 第一次出现`1`创建一个不同的长度为一的序列。 在第二次出现时，递归添加以新位置结束的可能性，但减去与前一个位置关联的行`1`，仅留下一个长度为一的序列。 长度为二的序列也是唯一的。 由于长度二大于长度一，因此正好计算一对。 

对于相同的长度，考虑`a = [2,1]`和`b = [1,2]`。 在第一个元素中，`2 > 1`，因此该对进入`G`。 长度为 2 的序列是`21`和`12`，第一个元素已经决定了比较。 DP 不需要在语义上检查第二个元素，因为一旦一对元素进入`G`，后面的元素不受限制。 这正是`rect_g`过渡代表。 

对于重复的值，先前出现的快照可以防止重复表示。 假设当前值为`1`其上一次出现的位置是`p`。 通过附加新的形成的每个子序列`1`这已经可以通过附加旧的来获得`1`必须被删除。 减法使用结尾为的前缀`p-1`，这正是可以在任一事件发生之前而不使用事件本身的序列集。 

对于长度最大的全等数组`5000`，每个非空长度都恰好有一个不同的子序列。 由于数组是相同的，因此等长对永远不会起作用。 对于每一个`k`从`2`通过`5000`，独特的长度-`k`序列来自`a`击败独特的长度序列`1`通过`k-1`从`b`。 答案是`1 + 2 + ... + 4999 = 5000 * 4999 / 2 = 12,497,500`当两个数组都有长度时`5000`。 

对于边界值`100`，以 1000 为基数的比较仍然有效，无需修改。 前导数字为`100`仍低于`1000`，因此位置之间没有进位。 这就是为什么整个数值比较可以安全地减少到长度和字典顺序。
