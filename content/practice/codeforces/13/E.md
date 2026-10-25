---
title: "CF 13E - 孔"
description: "我们有一排从左到右索引的孔。 每个洞都包含一个跳跃长度。 如果球落入 i 洞，它会立即移动到 i + a[i]。 从那里，它使用新洞的值再次跳转，并继续下去，直到下一次跳转离开数组。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dsu"]
categories: ["algorithms"]
codeforces_contest: 13
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 13"
rating: 2700
weight: 13
solve_time_s: 113
verified: true
draft: false
---
[CF 13E - 孔](https://codeforces.com/problemset/problem/13/E)

 **评分：** 2700
 **标签：** 数据结构，dsu
 **求解时间：** 1m 53s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一排从左到右索引的孔。 每个洞都包含一个跳跃长度。 如果球掉入洞中`i`，它立即移动到`i + a[i]`。 从那里，它使用新洞的值再次跳转，并继续下去，直到下一次跳转离开数组。 

有两种操作必须在线处理。 

第一个操作改变一个洞的跳跃长度。 

第二个操作从某个洞开始一个球并要求两个值：

 1. 球离开阵列之前访问的最后一个洞。 
2. 跳跃的总次数。 

该结构实际​​上是一个有向图，其中每个节点都只有一个出边，要么到另一个孔，要么到数组外部。 由于每次跳跃都严格向右移动，循环是不可能的。 每条路径最终都会离开数组。 

约束足够大，直接模拟太慢。 孔数和查询数均能达到`10^5`。 对每个查询的简单模拟可能每次都会遍历几乎整个数组。 在最坏的情况下，想象每个洞都有价值`1`。 从洞开始`1`需要`10^5`跳跃。 这样做是为了`10^5`查询会导致周围`10^10`操作，远远超出一秒钟的范围。 

更新操作使问题变得棘手。 一次预先计算所有答案是不够的，因为更改单个跳跃长度可能会影响许多路径。 

一些边缘情况很容易被错误处理。 

考虑这个输入：```
3 1
3 1 1
1 1
```从洞开始`1`，球立即退出，因为`1 + 3 = 4`。 正确答案是：```
1 1
```粗心的实施可能会打印漏洞`4`作为最后一个位置，即使问题要求在离开之前提供最后一个有效的洞。 

当更新更改仅在一个本地区域内跳转时，会出现另一种微妙的情况。```
5 3
1 1 1 1 1
0 3 5
1 1
```更新后路径变为：`1 -> 2 -> 3 -> outside`正确答案是：```
3 3
```如果更新后未正确重建预处理，则旧链中的陈旧信息可能会保留并产生更长的路径。 

最后一个常见错误来自块边界。```
6 1
2 2 2 2 2 2
1 1
```跳跃是：`1 -> 3 -> 5 -> outside`答案是：```
5 3
```当使用平方根分解时，许多实现会意外地停在块的最后一个索引处，而不是块外的第一个跳转处。 这打破了链压缩逻辑。 

## 方法

 蛮力解决方案直接模拟球的运动。 

对于从洞开始的查询`x`,反复跳转到`x + a[x]`直到该位置离开数组。 计算完成了多少次跳跃并记住最后一个有效的洞。 更新是微不足道的，因为我们只修改一个数组值。 

这是有效的，因为该图是非循环的并且每个模拟最终都会终止。 问题是运行时间。 在最坏的情况下，每次跳跃仅向右移动一步。 单个查询的成本`O(n)`。 和`10^5`查询，总复杂度变为`O(nm)`，这大约是`10^10`运营。 

关键的观察是跳跃只会向右移动。 因此，我们可以将索引分组到块中，并压缩同一块内的所有跳转。 

假设我们将数组分成大小约为`sqrt(n)`。 对于每个索引`i`，我们存储：

 1.当前块之外可到达的下一个位置`i`。 
2. 到达那里所需的跳跃次数。 
3. 离开区块之前访问的最后一个洞。 

现在，查询不再逐跳转走。 相反，它会逐块跳跃。 由于只有大约`sqrt(n)`块，每个查询变得更快。 

更新也是可以管理的。 改变`a[i]`只影响同一块内的路径，因为所有跳跃都向右移动。 我们可以重建一个街区`O(sqrt(n))`time instead of recomputing everything.

 这是经典的平方根分解，在块内进行路径压缩。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(nm)`|`O(1)`| 太慢了|
 | 最佳 |`O((n + m)\sqrt{n})`|`O(n)`| 已接受 |

 ## 算法演练

 1. 将数组分成大约大小的块`sqrt(n)`。 

如果`n = 10^5`，块大小约为`320`。 这大致给出了`320`块，这可以保持查询和更新的效率。 
2. 对于每个位置`i`，计算三个辅助值。`nxt[i]`存储在当前块之外到达的第一个位置。`cnt[i]`存储需要跳跃多少次才能到达`nxt[i]`。`last[i]`存储离开块之前访问的最后一个有效洞。 
3. 从右到左处理每个块内的索引。 

由于跳转总是转到较大的索引，因此在处理时已经计算了目的地信息`i`。 
4.让`j = i + a[i]`。 

如果`j`离开数组或属于另一个块：

 -`nxt[i] = j`-`cnt[i] = 1`-`last[i] = i`否则：

-`nxt[i] = nxt[j]`-`cnt[i] = cnt[j] + 1`-`last[i] = last[j]`这会将块内的所有跳转压缩为一个转换。 
5. 回答以下问题：`x`，反复：

 - 添加`cnt[x]`到答案。 
- 记录`last[x]`作为最新的有效洞。 
- 移至`nxt[x]`。 

继续直到`x > n`。 

每次迭代都会跳过整个块的跳跃。 
6. 处理位置更新`x`， 改变`a[x]`并仅重建包含的块`x`。 

较早的块不依赖于该块，因为跳跃严格向右移动。 

### 为什么它有效

 对于每个索引`i`，元组`(nxt[i], cnt[i], last[i])`summarizes the entire sequence of jumps inside the current block.

 If the next jump already leaves the block, the summary is immediate.

 否则，路径从`i`首先跳转到`j`在同一个块内，路径的其余部分正是预先计算的摘要`j`。 由于索引是从右到左处理的，因此该信息已经是正确的。 

在查询过程中，反复关注`nxt`再现精确的原始跳转序列，但压缩为块转换。 跳跃计数被保留，因为`cnt[i]`存储跳过的跳转的确切数量。 最后访问的洞被保留，因为`last[i]`跟踪跨越块边界或离开数组之前的最终有效位置。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    a = [0] + list(map(int, input().split()))

    B = int(n ** 0.5) + 1

    nxt = [0] * (n + 1)
    cnt = [0] * (n + 1)
    last = [0] * (n + 1)

    def rebuild(block):
        l = block * B + 1
        r = min(n, (block + 1) * B)

        for i in range(r, l - 1, -1):
            j = i + a[i]

            if j > n or (j - 1) // B != block:
                nxt[i] = j
                cnt[i] = 1
                last[i] = i
            else:
                nxt[i] = nxt[j]
                cnt[i] = cnt[j] + 1
                last[i] = last[j]

    num_blocks = (n + B - 1) // B

    for b in range(num_blocks - 1, -1, -1):
        rebuild(b)

    out = []

    for _ in range(m):
        query = list(map(int, input().split()))

        if query[0] == 0:
            x, y = query[1], query[2]
            a[x] = y
            rebuild((x - 1) // B)
        else:
            x = query[1]

            total = 0
            ans_last = x

            while x <= n:
                total += cnt[x]
                ans_last = last[x]
                x = nxt[x]

            out.append(f"{ans_last} {total}")

    sys.stdout.write("\n".join(out))

solve()
```该数组使用从 1 开始的索引来存储，因为问题陈述自然是从 1 开始的。 这避免了跳跃过程中重复的索引调整。 

这`rebuild`函数重新计算一个块的所有压缩信息。 从右到左处理索引是必不可少的。 处理时`i`, 目的地`j`总是大于`i`，因此其压缩信息已经可用。 

条件```
if j > n or (j - 1) // B != block:
```检查下一个跳转是否离开当前块。 这`(j - 1) // B`表达式将从 1 开始的索引转换为从 0 开始的块号。 缺少`-1`是一种常见的差一错误。 

在查询期间，循环不会单独模拟每个跳转。 相反，每次迭代都会使用直接跳到另一个块`nxt[x]`。 跳过的跳转总数是通过以下方式累积的`cnt[x]`。 

变量`ans_last`is updated before moving to the next block. 这保证了它在退出数组之前始终存储最终的有效洞。 

Updates only rebuild one block. 每次更新后重新计算整个结构会太慢。 

## 工作示例

 ### 示例 1

 输入：```
8 5
1 1 1 1 1 2 8 2
1 1
0 1 3
1 1
0 3 4
1 2
```假设块大小为`3`。 

初始压缩值：

 | 我| 一个[我] | nxt[i] | cnt[我] | 最后[i] |
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 4 | 3 | 3 |
 | 2 | 1 | 4 | 2 | 3 |
 | 3 | 1 | 4 | 1 | 3 |
 | 4 | 1 | 7 | 3 | 6 |
 | 5 | 1 | 7 | 2 | 6 |
 | 6 | 2 | 8 | 1 | 6 |
 | 7 | 8 | 15 | 15 1 | 7 |
 | 8 | 2 | 10 | 10 1 | 8 |

 处理查询`1 1`:

 | 当前 x | 添加了 cnt[x] | 最后[x] | nxt[x] |
 | ---| ---| ---| ---|
 | 1 | 3 | 3 | 4 |
 | 4 | 3 | 6 | 7 |
 | 7 | 1 | 7 | 15 | 15

 总跳跃次数 =`7`, 最后一洞 =`7`。 

更新后，压缩信息仅在受影响的块中发生变化。 

此跟踪演示了如何在一次操作中跳过块内的整个链。 

### 示例 2

 输入：```
5 2
1 1 1 1 1
0 3 5
1 1
```更新后，数组变为：

 | 我| 一个[我] |
 | ---| ---|
 | 1 | 1 |
 | 2 | 1 |
 | 3 | 5 |
 | 4 | 1 |
 | 5 | 1 |

 跳转序列来自`1`是：`1 -> 2 -> 3 -> outside`查询轨迹：

 | 当前 x | 添加了 cnt[x] | 最后[x] | nxt[x] |
 | ---| ---| ---| ---|
 | 1 | 2 | 2 | 3 |
 | 3 | 1 | 3 | 8 |

 回答：```
3 3
```此示例说明了为什么更新后需要重建修改的块。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O((n + m)\sqrt{n})`| 每次查询和更新最多触及`O(\sqrt{n})`块|
 | 空间|`O(n)`| 数组`a`,`nxt`,`cnt`， 和`last`每个孔存储一个值 |

 和`n, m <= 10^5`，平方根分解足够快。 大致`320`每个查询或更新的操作很容易满足 Python 的时间限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def solve():
        n, m = map(int, input().split())
        a = [0] + list(map(int, input().split()))

        B = int(n ** 0.5) + 1

        nxt = [0] * (n + 1)
        cnt = [0] * (n + 1)
        last = [0] * (n + 1)

        def rebuild(block):
            l = block * B + 1
            r = min(n, (block + 1) * B)

            for i in range(r, l - 1, -1):
                j = i + a[i]

                if j > n or (j - 1) // B != block:
                    nxt[i] = j
                    cnt[i] = 1
                    last[i] = i
                else:
                    nxt[i] = nxt[j]
                    cnt[i] = cnt[j] + 1
                    last[i] = last[j]

        num_blocks = (n + B - 1) // B

        for b in range(num_blocks - 1, -1, -1):
            rebuild(b)

        out = []

        for _ in range(m):
            q = list(map(int, input().split()))

            if q[0] == 0:
                x, y = q[1], q[2]
                a[x] = y
                rebuild((x - 1) // B)
            else:
                x = q[1]

                total = 0
                ans_last = x

                while x <= n:
                    total += cnt[x]
                    ans_last = last[x]
                    x = nxt[x]

                out.append(f"{ans_last} {total}")

        return "\n".join(out)

    return solve()

# provided sample
assert run(
"""8 5
1 1 1 1 1 2 8 2
1 1
0 1 3
1 1
0 3 4
1 2
"""
) == """8 7
8 5
7 3""", "sample 1"

# minimum size
assert run(
"""1 1
1
1 1
"""
) == "1 1", "single hole"

# all values equal
assert run(
"""5 1
1 1 1 1 1
1 1
"""
) == "5 5", "full linear chain"

# immediate exit
assert run(
"""3 1
3 1 1
1 1
"""
) == "1 1", "jump exits immediately"

# update changes path
assert run(
"""5 3
1 1 1 1 1
0 3 5
1 1
1 2
"""
) == """3 3
3 2""", "rebuild after update"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单孔|`1 1`| 最小约束|
 | 所有的|`5 5`| 最长的链条 |
 | 立即退出 |`1 1`| 正确的最后一洞处理 |
 | 更新更改路径|`3 3`,`3 2`| 更新后正确的块重建 |

 ## 边缘情况

 考虑第一次跳转退出数组的情况。```
3 1
3 1 1
1 1
```从洞`1`，跳转直接到`4`，它位于数组之外。 预处理期间：

 | 我| j = i + a[i] | j = i + a[i] | nxt[i] | cnt[我] | 最后[i] |
 | ---| ---| ---| ---| ---|
 | 1 | 4 | 4 | 1 | 1 |

 查询循环恰好执行一次压缩跳转并报告：```
1 1
```该算法正确存储最后一个有效孔，而不是超出范围的位置。 

现在考虑更改一个块内的结构的更新。```
5 2
1 1 1 1 1
0 3 5
1 1
```更新后`a[3] = 5`，重建块重新计算：

 | 我| nxt[i] | cnt[我] | 最后[i] |
 | ---| ---| ---| ---|
 | 3 | 8 | 1 | 3 |
 | 2 | 3 | 1 | 2 |
 | 1 | 3 | 2 | 2 |

 查询如下：`1 -> 3 -> outside`并返回：```
3 3
```仅重建修改后的块，但这已经足够了，因为所有边缘都指向右侧。 

最后，考虑正好落在块边界上的跳跃。```
6 1
2 2 2 2 2 2
1 1
```假设块大小为`2`。 

路径是：`1 -> 3 -> 5 -> outside`预处理识别出每次跳转都会立即离开当前块：

 | 我| nxt[i] | cnt[我] | 最后[i] |
 | ---| ---| ---| ---|
 | 1 | 3 | 1 | 1 |
 | 3 | 5 | 1 | 3 |
 | 5 | 7 | 1 | 5 |

 该查询累积了三个压缩跳转并正确输出：```
5 3
```这证实了块转换逻辑正确处理边界交叉。
