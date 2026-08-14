---
title: "CF 102309B - Orz Pandas 的暴力破解"
description: "该程序生成河内塔问题的标准递归解决方案。 对于一个有 n 个磁盘的塔，它首先将顶部的 n-1 个磁盘从源桩移动到辅助桩，然后将第 n 个磁盘从源移动到目标，最后将 n-1 个磁盘从..."
date: "2026-08-13T23:42:49+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102309
codeforces_index: "B"
codeforces_contest_name: "The 2019 \u201cOrz Panda\u201d Cup Programming Contest"
rating: 0
weight: 102309
solve_time_s: 77
verified: true
draft: false
---

[CF 102309B - Orz Pandas 的暴力破解](https://codeforces.com/problemset/problem/102309/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该程序生成河内塔问题的标准递归解决方案。 对于一座塔`n`磁盘，它首先移动顶部`n-1`将磁盘从源桩移动到辅助桩，然后移动磁盘`n`从源点到目的点，最后移动`n-1`磁盘从辅助挂钩到目的地。 

对于每个测试用例，`n`是磁盘数量，`k`是生成的输出中从一开始的位置。 我们需要准确确定该位置出现哪一步棋`k`，而不生成前面的动作。 初始角色固定为源`A`， 目的地`B`，以及辅助`C`。 如果完整的河内解包含少于`k`移动，答案是`Orz`。 

一座塔与`n`磁盘准确地产生`2^n - 1`移动。 既然两者`n`和`k`可以大到`10^18`，直接模拟递归是不可能的。 甚至`n = 60`已经生产了`2^60 - 1 = 1,152,921,504,606,846,975`移动次数，超过了最大可能的移动次数`k`。 该算法必须在不迭代所有动作的情况下工作，并且它甚至无法承担与`n`什么时候`n`本身就是`10^18`。 

有几种边界情况可能会使看似正确的实现失败。 有输入`1 1`，唯一的举动是`move 1 from A to B`。 使用从零开始的索引的实现可能会意外地拒绝这第一步。 有输入`1 2`，正确的结果是`Orz`，因为单盘塔只有一根输出线。 粗心的实施检查`k >= 2^n - 1`而不是`k > 2^n - 1`会错误地拒绝最后一个有效的举动。 为了`n = 59`，总移动次数为`2^59 - 1`， 所以`59 576460752303423487`有效并要求最后一步，而`59 576460752303423488`必须产生`Orz`。 最后，对于非常大的`n`， 例如`1000000000000000000 1`，答案是`move 1 from A to C`，因为均匀大小的河内解决方案首先将最小的圆盘移向辅助钉。 简单递减的循环`n`在这种情况下，一次一个级别永远无法完成。 

## 方法

 直接的方法是执行给定的递归过程并计算已经生成了多少行，直到到达行`k`。 这是正确的，因为程序本身定义了确切的输出顺序。 移动次数的递推式为`M(n) = 2M(n-1) + 1`和`M(0) = 0`, 给予`M(n) = 2^n - 1`。 因此最坏的情况需要`2^n - 1`生成的移动，以及相当数量的递归调用。 为了`n = 60`，这已经是关于`1.15 * 10^18`动，所以暴力是完全行不通的。 

有用的观察是递归将输出分为三个连续的部分。 拨打电话`H(n, from, to, another)`，第一个`2^(n-1)-1`线路属于`H(n-1, from, another, to)`。 下一行是磁盘的单次移动`n`，以及剩余的`2^(n-1)-1`线路属于`H(n-1, another, to, from)`。 

这意味着我们永远不需要生成移动。 我们只需要决定这三个区域中哪一个包含位置`k`。 如果`k`位于第一个区域，我们进入第一个递归子问题。 如果它等于紧邻该区域之后的边界线，我们就找到了答案。 否则，我们减去整个第一个区域和中间的移动`k`，然后进入第二个子问题。 

剩下的困难就是`n`本身可以是`10^18`。 幸运的是，`k`至多是`10^18`。 一次`n`大于`60`，第一个递归块包含`2^(n-1)-1`，这肯定比所有可能的都大`k`。 我们可以立即跳过所有这些第一次递归级别。 每个这样的级别都会改变角色`to`和`another`，所以跳过之后`t`级别，我们恰好交换这两个角色`t`很奇怪。 然后我们可以正常继续`n = 60`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^n) | O(2^n) | O(n) 递归深度 | 太慢了|
 | 最佳| O(分钟(n, 60)) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1、首先判断请求的线路是否可以存在。 什么时候`n < 60`，总移动次数为`2^n - 1`，所以如果`k`大于该值，输出`Orz`。 什么时候`n >= 60`，每一个允许的`k <= 10^18`是有效的，因为`2^60 - 1 > 10^18`。 
2.如果`n > 60`, 跳过第一个`n - 60`递归级别。 在每个跳过的级别，所需的位置必然位于第一个递归调用内，其参数从`(from, to, another)`到`(from, another, to)`。 因此，只有跳过级别的数量奇偶性才重要。 如果`n - 60`是奇数，交换`to`和`another`，然后设置`n = 60`。 
3. 对于当前状态，计算`half = 2^(n-1)`。 第一个递归块包含`half - 1`移动，因此中间移动恰好发生在位置`half`。 
4. 如果`k == half`，所请求的线是当前河内子问题的中间移动。 其磁盘号为`n`，并且它从`from`到`to`，所以返回`move n from from to to`。 
5.如果`k < half`，答案就在第一个递归块中。 将挂钩角色替换为`(from, another, to)`并减少`n`一个。 的价值`k`不会改变，因为目标位置仍然是从该子问题的开头开始测量的。 
6. 如果`k > half`，答案就在第二个递归块中。 删除第一个`half - 1`通过设置移动和中间移动`k = k - half`。 第二个块有参数`(another, to, from)`，因此相应地更新三个挂钩角色并减少`n`一个。 
7. 继续直至到达中间位置。 最多 60 级之后剩余`n`捷径，因此每个测试用例都会在少量迭代后完成。 

### 为什么它有效

 不变的是，在每次迭代中，当前状态`(n, k, from, to, another)`准确描述了递归 Hanoi 调用，其输出包含原始请求的行。 该调用的输出始终包含第一个块`2^(n-1)-1`移动，在该位置进行一次中间移动`2^(n-1)`，以及相同大小的第二个块。 该算法准确地选择包含的块`k`，更改挂钩角色以匹配相应的递归调用。 什么时候`k`到达中间位置，递归程序将打印磁盘`n`从`from`到`to`，因此构造的线正是所需的输出线。 大型-`n`快捷方式是有效的，因为每个跳过的级别都必须进入其第一个递归块，并且重复这样做的唯一效果是交替`to`和`another`挂钩角色。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def kth_move(n, k):
    # For n < 60 we can check the exact number of moves.
    if n < 60 and k > (1 << n) - 1:
        return "Orz"

    # For n > 60, k <= 10^18 is always inside the first
    # recursive block for every skipped level.
    if n > 60:
        skipped = n - 60
        if skipped & 1:
            # Every first-recursion step swaps 'to' and 'another'.
            pass
        n = 60
    else:
        skipped = 0

    from_peg, to_peg, aux_peg = 'A', 'B', 'C'

    if skipped & 1:
        to_peg, aux_peg = aux_peg, to_peg

    while n > 0:
        half = 1 << (n - 1)

        if k == half:
            return f"move {n} from {from_peg} to {to_peg}"

        if k < half:
            # H(n-1, from, aux, to)
            to_peg, aux_peg = aux_peg, to_peg
        else:
            # Skip the first block and the middle move.
            k -= half

            # H(n-1, aux, to, from)
            from_peg, to_peg, aux_peg = aux_peg, to_peg, from_peg

        n -= 1

    return "Orz"

def solve():
    out = []

    for line in sys.stdin:
        if not line.strip():
            continue

        n, k = map(int, line.split())
        out.append(kth_move(n, k))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```初始有效性检查使用`k > (1 << n) - 1`， 不是`>=`，因为最后一步恰好是`2^n - 1`是有效的。 该检查仅针对`n < 60`，因为对于`n >= 60`总移动次数已超过允许的次数`k`。 

为了`n > 60`，代码首先计算可以跳过多少层。 在每个级别上，`k`必须位于第一个递归调用中。 那个电话一直在`from`交换时不变`to`和`another`。 重复此转换偶数次可恢复原始顺序，而奇数次则交换两个钉子。 该代码准确地捕获了这一点`skipped & 1`。 

归约后，循环直接实现 Hanoi 递归的三个区域。`half`是当前磁盘移动的位置，因为第一个递归调用贡献了`2^(n-1)-1`线。 平等确定了答案。 较小的`k`进入第一个递归调用而不改变`k`，而较大的`k`删除第一个递归调用后进入第二个递归调用`half`线。 

Python整数具有任意精度，因此在计算2的幂时不存在溢出问题。 该实现仅计算幂`2^59`在主循环内，所有挂钩更新都在递减之前发生`n`，与递归调用完全匹配。 

## 工作示例

 对于第一个样本，`n = 5`和`k = 10`。 

| n | k | 一半| 决定| 来自| 至 | 辅助|
 | ---| ---| ---| ---| ---| ---| ---|
 | 5 | 10 | 10 16 | 16 第一个区块 | 一个 | C | 乙|
 | 4 | 10 | 10 8 | 第二个块，k = 2 | 乙| C | 一个 |
 | 3 | 2 | 4 | 第一个区块 | 乙| 一个 | C |
 | 2 | 2 | 2 | 答案| 乙| 一个 | C |

 在`n = 2`，中间的位置是`2`，所以答案是`move 2 from B to A`，与示例中完全相同。 该跟踪说明了为什么必须通过递归来实现挂钩恒等式，而不是假设每个子问题仍然从`A`到`B`。 

对于第二个样本，`n = 5`和`k = 100`。 

| n | k | 总动作 | 决定|
 | ---| ---| ---| ---|
 | 5 | 100 | 100 31 | 无效|

 五盘河内解决方案仅包含`31`移动。 自从`100 > 31`，算法立即返回`Orz`。 不需要递归遍历。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(分钟(n, 60)) | 跳过大的后最多处理 60 个递归级别`n`。 |
 | 空间| O(1) | O(1) | 仅存储当前磁盘计数、位置和三个钉标签。 |

 60 的固定界限直接来自`k <= 10^18`和`2^60 > 10^18`。 即使当`n`与`10^18`，该算法执行的迭代次数不会超过 60 次。 它使用常量内存，并且不构造指数级大河内输出的任何部分。 

## 测试用例```python
import sys
import io

def solve_text(inp: str) -> str:
    def kth_move(n, k):
        if n < 60 and k > (1 << n) - 1:
            return "Orz"

        skipped = 0
        if n > 60:
            skipped = n - 60
            n = 60

        from_peg, to_peg, aux_peg = 'A', 'B', 'C'

        if skipped & 1:
            to_peg, aux_peg = aux_peg, to_peg

        while n > 0:
            half = 1 << (n - 1)

            if k == half:
                return f"move {n} from {from_peg} to {to_peg}"

            if k < half:
                to_peg, aux_peg = aux_peg, to_peg
            else:
                k -= half
                from_peg, to_peg, aux_peg = aux_peg, to_peg, from_peg

            n -= 1

        return "Orz"

    out = []
    for line in inp.splitlines():
        if line.strip():
            n, k = map(int, line.split())
            out.append(kth_move(n, k))

    return "\n".join(out)

# Provided samples
assert solve_text("5 10\n") == "move 2 from B to A", "sample 1"
assert solve_text("5 100\n") == "Orz", "sample 2"

# Minimum-size inputs
assert solve_text("1 1\n") == "move 1 from A to B", "minimum valid case"
assert solve_text("1 2\n") == "Orz", "just beyond the minimum case"

# Equal values, n = k
assert solve_text("5 5\n") == "move 1 from C to A", "n equals k"

# Exact last valid position and first invalid position
assert solve_text("59 576460752303423487\n") == \
       "move 1 from A to B", "last valid move"
assert solve_text("59 576460752303423488\n") == \
       "Orz", "first invalid move"

# Large n, forcing the large-n shortcut
assert solve_text("1000000000000000000 1\n") == \
       "move 1 from A to C", "huge even n"

# Large odd n, checking the parity of skipped levels
assert solve_text("999999999999999999 1\n") == \
       "move 1 from A to B", "huge odd n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1`|`move 1 from A to B`| 最小有效输入和基于一的索引 |
 |`1 2`|`Orz`| 超出总产量第一名 |
 |`5 5`|`move 1 from C to A`| 一般递归下降`n = k`|
 |`59 576460752303423487`|`move 1 from A to B`| 准确的最终有效位置 |
 |`59 576460752303423488`|`Orz`| 确切的第一个无效位置 |
 |`1000000000000000000 1`|`move 1 from A to C`| 巨大的`n`和基于奇偶校验的跳过|
 |`999999999999999999 1`|`move 1 from A to B`| 巨大的奇怪`n`和相反的奇偶校验 |

 ## 边缘情况

 对于`1 1`，算法计算`half = 1`。 自从`k == half`，它立即返回`move 1 from A to B`。 这是递归的基本情况，并确认该位置是从一开始的。 

为了`1 2`，总移动次数为`2^1 - 1 = 1`。 初始有效性检查检测`2 > 1`并返回`Orz`在进入循环之前。 这避免了依赖循环来检测不可能的位置。 

为了`59 576460752303423487`，所要求的位置正是`2^59 - 1`，整个解决方案的最后一步。 有效性检查接受它，因为条件严格大于总数。 递归下降最终到达最终位置并返回`move 1 from A to B`。 将支票替换为`k >= (1 << n) - 1`会错误地拒绝此案。 

为了`59 576460752303423488`,`k`正好比总移动次数大 1。 有效性检查返回`Orz`立即地。 此边界特别有用，因为具有相差一错误的实现很容易将最后一个有效位置与第一个无效位置混淆。 

为了`1000000000000000000 1`，算法不能递减`n`一次一个级别。 它会跳过`999999999999999940`级别并仅保留该数字的奇偶性。 由于跳过的计数是偶数，因此挂钩角色仍然存在`A, B, C`当算法达到`n = 60`。 最终的第一步是`move 1 from A to C`，与均匀大小的 Hanoi 解决方案的行为相匹配。 

为了`999999999999999999 1`，跳过的层数为奇数。 算法交换`B`和`C`在处理剩余的 60 个级别之前。 该挂钩排列将第一步更改为`move 1 from A to B`。 这个案例证实了跳过大量递归级别不能简单地丢弃级别本身，因为它们的奇偶性改变了剩余子问题所使用的钉子的身份。
