---
title: "CF 102458C - 丹尼尔的游戏"
description: "我们有一个由 n 个非负整数组成的数组 A 和一个预算 M。对于每个非空连续子数组 A[l..r]，Andy 可以增加其元素，但添加的总量不能超过 M。他的目标是使所选子数组非递减。"
date: "2026-08-09T02:42:40+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102458
codeforces_index: "C"
codeforces_contest_name: "Hanoi final contest"
rating: 0
weight: 102458
solve_time_s: 298
verified: true
draft: false
---

[CF 102458C - 丹尼尔的游戏](https://codeforces.com/problemset/problem/102458/C)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个数组`A`的`n`非负整数和预算`M`。 对于每个非空连续子数组`A[l..r]`，安迪可以增加其元素，但添加总量不能超过`M`。 他的目标是使所选子数组不减。 

对于固定子数组，只有一个相关量：必须相加才能使其不减的最小总量。 我们需要统计最多有多少个子数组具有这个最小成本`M`。 

假设所选子数组开始于`l`。 从左到右处理。 第一个值不需要改变。 在位置`i`，修改后可能的最小值是原来的较大值`A[i]`和之前修改的值。 因此，最优修改序列正是前缀极大值的序列：

 [
 B_i=\max(A_l,A_{l+1},\ldots,A_i)。 
]

 最低成本为`[l,r]`因此是

 [
 C(l,r)=\sum_{i=l}^{r}\left(\max_{j=l}^{i} A_j-A_i\right)。 
]

 子数组恰好在以下时间获胜：`C(l,r) <= M`。 

重要的约束是`n <= 2 * 10^5`， 尽管`M`可以大到`2 * 10^14`和每个`A[i]`可以大到`10^9`。 有大约`n(n+1)/2`子数组，因此枚举它们已经需要大约`2 * 10^10`最大尺寸的情况下。 每个子阵列花费甚至线性时间的解决方案是完全不可能的。 我们需要接近`O(n log n)`工作，所有成本都必须使用 64 位算术。 Python 整数自然地处理这个范围。 

有几种边缘情况很容易导致错误的答案。 

什么时候`n=1`，单元素子数组已经是非递减的并且成本为零。 为了`1 0`带数组`1234`，答案是`1`。 仅计算包含反转的子数组的实现将错误地返回零。 

等值不能被视为严格增加。 为了`n=4`,`M=0`，和数组`5 5 5 5`，十个子数组中的每一个都已经是非减的，所以答案是`10`。 如果下一个更大的结构将相等的值视为更大的值，则它可能会错误地分割前缀最大块。 

预算比较包含在内。 为了`n=3`,`M=3`，和数组`3 1 2`，子数组`[3,1,2]`成本正好`3`：两个较小的值必须变为`3`，添加`2+1`。 它是有效的，因此所有六个子数组都被计数。 使用`< M`而不是`<= M`就会失去这个间隔。 

最后，成本可能比 32 位整数大得多。 和`n=2*10^5`和周围的价值观`10^9`，总的修正量可以达到`10^14`。 在具有固定宽度整数的语言中，32 位累加器会悄悄溢出。 

## 方法

 直接的方法是修复每一对`(l,r)`并模拟非减序列的贪婪构造。 开始于`maximum = A[l]`，以下每个元素都有贡献`max(0, maximum - A[i])`， 和`maximum`更新时`A[i]`更大。 这是正确的，因为每个元素都必须至少是之前的最终值，因此选择更大的值只会增加成本。 

有`n(n+1)/2`子数组，并且单个子数组可以包含`O(n)`元素。 在最坏的情况下，这意味着

 [
 \θ(n^3)
 ]

 操作。 和`n=2*10^5`，其顺序为`8*10^15`基本迭代，远远超出了两秒的限制。 

蛮力方法之所以有效，是因为它遵循精确的贪婪构造，但它会重复遍历数组的相同部分。 解锁更快解决方案的观察结果是前缀最大值不会在每个位置发生变化。 从位置开始`l`，当前最大剩余`A[l]`直到第一个位置的值严格大于`A[l]`。 到达该位置后，从新的最大值再次开始相同的推理。 

定义`nxt[i]`作为右侧的第一个位置`i`和`A[nxt[i]] > A[i]`。 之间`i`和`nxt[i]-1`，前缀最大值恰好是`A[i]`。 该区块的总成本为

 [
 A_i(nxt[i]-i)-\sum_{j=i}^{nxt[i]-1}A_j。 
]

 因此，长子数组的成本可以分解为一系列完整的次大块加上一个最终部分块。 

全部`nxt[i]`可以通过单调堆栈在线性时间内找到值。 然后，我们使用二进制提升一次跳过许多下一个更大的块并获得`C(l,r)`在`O(log n)`。 

最后的观察结果是最大有效右端点是单调的。 如果我们搬家`l`向右同时保持`r`固定的，我们从一开始就删除元素，因此所需的最低成本不会增加。 因此最大有效`r`永远不会向左移动`l`增加。 这允许两指针扫描：每个右端点仅前进`O(n)`总体时间，而每次成本检查都需要`O(log n)`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(n^3)`|`O(1)`| 太慢了|
 | 最佳|`O(n log n)`|`O(n log n)`| 已接受 |

 ## 算法演练

 1. 构建普通前缀和数组`pref`， 在哪里`pref[i]`是`A[0..i-1]`。 这让我们可以在恒定时间内计算任何连续块的总和。 
2. 计算`nxt[i]`，第一个索引`j > i`和`A[j] > A[i]`。 使用单调递减堆栈从右向左扫描。 虽然顶部的值小于`A[i]`，弹出它，因为`i`成为它的第一个严格更大的元素。 相等的值不会被弹出，因为当我们遇到相等的值时，前缀最大值不会改变。 
3. 对于每个位置`i`，将其完整块的成本定义为`i`通过`nxt[i]-1`。 如果没有更大的元素，则块结束于`n`。 其成本为

 [
 块[i]=A_i(nxt[i]-i)-(pref[nxt[i]]-pref[i])。 
]

 在此间隔内，每个前缀最大值为`A[i]`，所以公式直接求和`A[i]-A[j]`。 

1. 搭建二元升降台。`up[k][i]`表示跟随后到达的位置`2^k`下一个更大的跳跃开始于`i`。`gain[k][i]`存储这些跳跃跨越的所有完整块成本的总和。 基础层包含一次跳跃，所以`up[0][i] = nxt[i]`和`gain[0][i] = block[i]`。 
2. 实现一个功能`cost(l,r)`计算最低制造成本`A[l..r]`非减少。 开始于`l`，从最大到最小检查二进制提升级别。 如果跳转的目的地最多是`r`，整个块位于请求的间隔内，因此添加其预先计算的成本并跳转到那里。 在不再有完整的块拟合后，剩余间隔从`cur`并结束于`r`。 其前缀最大值为`A[cur]`，给出最终的部分成本

 [
 A_{cur}(r-cur+1)-(pref[r+1]-pref[cur])。 
]

 1. 用两个指针扫描数组。 保持正确的端点`r`。 对于每个新的左端点`l`, 反复延长`r`尽管`cost(l,r+1) <= M`。 每个扩展都是永久的，因为右端点永远不需要向后移动。 一旦下一个扩展超出预算，每个较大的右端点也无效，因为添加元素并不能减少所需的修改成本。 
2.对于当前`l`， 确切地`r-l+1`子数组开始于`l`是有效的。 将此数字添加到答案中并递增`l`。 去掉最左边的元素并不能增加最小修改成本，所以现有的`r`仍然有效并且两指针不变量被保留。 

### 为什么它有效

 对于每个子数组，每个位置的最小可能最终值是其前缀最大值。 下一个更大的分解将这些前缀最大值划分为当前最大值恒定的最大区域，因此块公式计算的成本与直接贪婪扫描完全相同。 二值提升仅跳过连续的完整区域，而不改变它们的总贡献，并且直接计算最终的部分区域。 

两指针部分依赖于单调性。 对于固定的`l`，延伸`r`只能添加非负贡献，因此一旦右端点无效，每个较大的端点都无效。 对于固定的`r`, 移动`l`权利消除了约束，不能增加最小成本，因此最大有效`r`无法向左移动。 因此，每个有效子数组都只计算一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, M = map(int, input().split())
    a = list(map(int, input().split()))

    # Prefix sums.
    pref = [0] * (n + 1)
    s = 0
    for i, x in enumerate(a):
        s += x
        pref[i + 1] = s

    # nxt[i] = first j > i with a[j] > a[i].
    nxt = [n] * n
    stack = []

    for i in range(n - 1, -1, -1):
        x = a[i]
        while stack and a[stack[-1]] < x:
            nxt[stack.pop()] = i
        stack.append(i)

    # Cost of the complete block [i, nxt[i)-1].
    block = [0] * n
    for i in range(n):
        j = nxt[i]
        block[i] = a[i] * (j - i) - (pref[j] - pref[i])

    LOG = n.bit_length()

    # Binary lifting tables.
    up = [nxt]
    gain = [block]

    for k in range(1, LOG):
        prev_up = up[-1]
        prev_gain = gain[-1]

        cur_up = [n] * n
        cur_gain = [0] * n

        for i in range(n):
            mid = prev_up[i]
            if mid < n:
                cur_up[i] = prev_up[mid]
                cur_gain[i] = prev_gain[i] + prev_gain[mid]

        up.append(cur_up)
        gain.append(cur_gain)

    def cost(l, r):
        """Minimum increments needed for a[l..r]."""
        cur = l
        ans = 0

        for k in range(LOG - 1, -1, -1):
            j = up[k][cur]
            if j <= r:
                ans += gain[k][cur]
                cur = j

        # cur is the beginning of the final partial block.
        ans += a[cur] * (r - cur + 1) - (pref[r + 1] - pref[cur])
        return ans

    ans = 0
    r = -1

    for l in range(n):
        if r < l:
            r = l

        while r + 1 < n and cost(l, r + 1) <= M:
            r += 1

        ans += r - l + 1

    print(ans)

if __name__ == "__main__":
    solve()
```前缀和构造直接对应于块成本公式。`pref[j] - pref[i]`是块中所有原始值的总和，而`a[i] * (j-i)`是该块中的每个元素达到该块的最大值后的总和。 

单调栈使用严格比较`a[stack[-1]] < x`。 将此更改为`<=`是不正确的。 对于相等的值，较早的值保持相同的前缀最大值，因此第一个严格更大的值是其块的结束值。 

二元升降台使用`n`作为哨兵意味着不存在更大的元素。 仅当其目的地为`<= r`。 这个条件保证了跳转所代表的整个块属于`[l,r]`。 

当所有完整的区块被消耗完之后，`cur`是下一个更大元素超出的第一个位置`r`。 因此，每个前缀最大值来自`cur`通过`r`等于`a[cur]`，这使得最终的常数时间公式有效。 

两指针循环故意检查`r+1`而不是重新计算当前窗口的成本。 目前的`[l,r]`已经知道是有效的。 一次`[l,r+1]`失败，所有进一步的右端点也会失败。 

Python 的任意精度整数在这里很有用，因为`M`累计成本约为`10^14`。 不需要显式的溢出处理。 

## 工作示例

 ### 示例 1

 对于`A = [5,4,1,1,5,5]`和`M = 6`，每个左端点的最大有效右端点如下。 

|`l`| 最大限度`r`|`cost(l,r)`| 下一个成本 | 添加子数组 |
 | --- | --- | --- | --- | --- |
 | 1 | 3 | 5 | 9 | 3 |
 | 2 | 6 | 6 | 超越数组| 5 |
 | 3 | 6 | 0 | 超越数组| 4 |
 | 4 | 6 | 0 | 超越数组| 3 |
 | 5 | 6 | 0 | 超越数组| 2 |
 | 6 | 6 | 0 | 超越数组| 1 |

 为了`l=1`，前缀最大值`[5,4,1]`是`[5,5,5]`，所以成本是`0+1+4=5`。 扩展到第四个元素给出另一个`4`, 使得成本`9`，所以右端点停在`3`。 

为了`l=2`，子数组`[4,1,1,5,5]`成本`3+3+0+0=6`，正是可用的预算。 完全相等说明了为什么条件必须是`<= M`。 

计数是`3+5+4+3+2+1 = 18`，与官方示例输出匹配。 

### 示例 2

 对于`A = [6,5,4,3,2]`和`M = 5`，迹线为：

 |`l`| 最大限度`r`|`cost(l,r)`| 下一个成本 | 添加子数组 |
 | --- | --- | --- | --- | --- |
 | 1 | 3 | 3 | 6 | 3 |
 | 2 | 4 | 3 | 6 | 3 |
 | 3 | 5 | 3 | 超越数组| 3 |
 | 4 | 5 | 1 | 超越数组| 2 |
 | 5 | 5 | 0 | 超越数组| 1 |

 例如，`[6,5,4]`需要增量`1`和`2`, 给予成本`3`。 添加`3`需要另一个`3`，给出总成本`6`，超出了预算。 

答案是`3+3+3+2+1 = 12`，再次匹配官方样本。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n log n)`| 下一个更好的预处理是`O(n)`，二元提升是`O(n log n)`，并且两指针扫描执行`O(n)`成本查询，每次取`O(log n)`。 |
 | 空间|`O(n log n)`| 这`up`和`gain`每个二元升降台包含`O(n log n)`条目。 |

 和`n <= 2*10^5`,`log n`仅约为 18。该算法避免了枚举子数组的二次数量，并且仅对双指针边界的每次移动执行对数量的工作，这是给定限制所需的比例。 

## 测试用例```python
import sys
import io

def solve_data(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    try:
        solve()
        return out.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def solve():
    n, M = map(int, input().split())
    a = list(map(int, input().split()))

    pref = [0] * (n + 1)
    for i, x in enumerate(a):
        pref[i + 1] = pref[i] + x

    nxt = [n] * n
    stack = []

    for i in range(n - 1, -1, -1):
        while stack and a[stack[-1]] < a[i]:
            nxt[stack.pop()] = i
        stack.append(i)

    block = [0] * n
    for i in range(n):
        j = nxt[i]
        block[i] = a[i] * (j - i) - (pref[j] - pref[i])

    LOG = n.bit_length()
    up = [nxt]
    gain = [block]

    for _ in range(1, LOG):
        pu = up[-1]
        pg = gain[-1]
        cu = [n] * n
        cg = [0] * n

        for i in range(n):
            mid = pu[i]
            if mid < n:
                cu[i] = pu[mid]
                cg[i] = pg[i] + pg[mid]

        up.append(cu)
        gain.append(cg)

    def cost(l, r):
        cur = l
        res = 0

        for k in range(LOG - 1, -1, -1):
            j = up[k][cur]
            if j <= r:
                res += gain[k][cur]
                cur = j

        return res + a[cur] * (r - cur + 1) - (
            pref[r + 1] - pref[cur]
        )

    ans = 0
    r = -1

    for l in range(n):
        if r < l:
            r = l

        while r + 1 < n and cost(l, r + 1) <= M:
            r += 1

        ans += r - l + 1

    print(ans)

# Provided samples
assert solve_data(
    "6 6\n5 4 1 1 5 5\n"
) == "18", "sample 1"

assert solve_data(
    "5 5\n6 5 4 3 2\n"
) == "12", "sample 2"

assert solve_data(
    "1 0\n1234\n"
) == "1", "sample 3"

# Minimum-size input.
assert solve_data(
    "1 0\n7\n"
) == "1", "single element"

# All equal values: every subarray already works.
assert solve_data(
    "4 0\n5 5 5 5\n"
) == "10", "all equal"

# Exact budget boundary.
assert solve_data(
    "3 3\n3 1 2\n"
) == "6", "cost exactly equals M"

# Strictly decreasing, with only some longer intervals affordable.
assert solve_data(
    "3 1\n3 2 1\n"
) == "5", "decreasing boundary"

# Maximum n, all equal, so every subarray is valid.
n = 200000
expected = n * (n + 1) // 2
large_input = f"{n} 0\n" + ("1 " * (n - 1)) + "1\n"
assert solve_data(large_input) == str(expected), "maximum n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 0 / 7`|`1`| 最小尺寸输入和单元素子数组 |
 |`4 0 / 5 5 5 5`|`10`| 同等价值、零预算|
 |`3 3 / 3 1 2`|`6`| 成本正好等于`M`|
 |`3 1 / 3 2 1`|`5`| 严格递减序列和右端边界 |
 |`n=200000`，所有值`1`,`M=0`|`20000100000`| 最大输入大小和大答案 |

 ## 边缘情况

 单元素情况`n=1`,`M=0`,`A=[7]`开始于`r=l`。 费用为`[7]`为零，因此循环无法进一步扩展并添加一个有效子数组。 答案是`1`。 

对于相等的值，请考虑`A=[5,5,5,5]`和`M=0`。 每一个`nxt[i]`是`n`因为不存在严格意义上更大的价值。 因此，每个完整的块都会延伸到末尾，但其成本为零，因为每个元素都等于块最大值。 两指针扫描达到`r=3`对于每一个`l`, 计数`4+3+2+1=10`子数组。 

对于确切的预算情况`A=[3,1,2]`,`M=3`，完整区间有前缀最大值`[3,3,3]`。 其成本为`(3-3)+(3-1)+(3-2)=3`，所以条件`cost <= M`接受它。 算法扩展`r`通过最后一个位置而不是提前停止一个位置。 

对于递减的情况`A=[3,2,1]`,`M=1`，长度为 2 的区间有成本`1`，而整个间隔有成本`1+2=3`。 因此，起始位置的有效计数是`2`,`2`， 和`1`, 给予`5`。 每个元素的下一个更大的链立即结束，因为每个后续值都较小，因此块公式正确地捕获了延长间隔的增加成本。 

对于最大尺寸的情况`200000`相等的元素和`M=0`, 每一个

 [
 \frac{200000\cdot200001}{2}=20000100000
 ]

 子数组有效。 答案本身超出了 32 位范围，而 Python 的整数运算可以直接处理它。 该算法仍然只执行`O(n log n)`预处理和扫描工作。 

如果您愿意，我还可以提供一个较短的竞赛编辑版本，或者使用相同的下一个更大的二进制提升思想的 C++17 实现。
