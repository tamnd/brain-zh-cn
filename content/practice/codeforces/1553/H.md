---
title: "CF 1553H - 异或和距离"
description: "我们有一组不同的整数 $a1,dots,an$，每个整数都在 $[0,2^k)$ 范围内。 对于每个掩码 $x$，我们将每个数组元素与 $x$ 进行异或，生成集合 $${a1oplus x,dots,anoplus x}。$$ 在该转换集中的所有对中，我们想要最小的绝对差异。"
date: "2026-06-10T13:07:43+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "divide-and-conquer", "trees"]
categories: ["algorithms"]
codeforces_contest: 1553
codeforces_index: "H"
codeforces_contest_name: "Harbour.Space Scholarship Contest 2021-2022 (open for everyone, rated, Div. 1 + Div. 2)"
rating: 2900
weight: 1553
solve_time_s: 169
verified: true
draft: false
---

[CF 1553H - 异或和距离](https://codeforces.com/problemset/problem/1553/H)

 **评分：** 2900
 **标签：** 位掩码、分而治之、树
 **求解时间：** 2m 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一组不同的整数$a_1,\dots,a_n$，每个都位于范围内$[0,2^k)$。 

对于每一个面膜$x$，我们对每个数组元素进行异或$x$，产生集合$$\{a_1\oplus x,\dots,a_n\oplus x\}.$$在该变换集中的所有对中，我们想要最小的绝对差。 令该值为$f(x)$。 

任务是计算$f(x)$对于每一个面具$x\in[0,2^k)$。 

首先让这个问题变得困难的是，有多达$2^{19}=524288$不同的面具，我们需要为每一个面具找到答案。 任何独立处理每个查询掩码的解决方案都已经陷入了麻烦。 

第二个障碍是$n$也可以大到$2^k$。 即使检查所有对中的单个掩码也需要$O(n^2)$，这是完全不可能的。 

有趣的是$k\le 19$。 当位宽这么小时，直接对整体起作用的解决方案$2^k$掩模空间变得真实。 周围的复杂性$O(k2^k)$大约是一千万次操作，这很合适。 

一个常见的错误是认为 XOR 保留了差异。 事实并非如此。 例如，用数字$0$和$3$，差异是$3$，但在异或之后$1$他们成为$1$和$2$，其差别仅在于$1$。 

另一个简单的陷阱是假设异或之前最接近的对仍然是之后最接近的对。 考虑：```
a = [0, 3, 6]
```为了$x=0$，答案是$3$。 为了$x=1$，变换后的数字是$[1,2,7]$，答案就变成了$1$。 最佳配对的身份发生了变化。 

## 方法

 蛮力方法很简单。 

对于每一个面膜$x$，计算所有值$a_i\oplus x$，对它们进行排序，并扫描相邻元素以找到最小差异。 排序数组中最接近的一对必须是相邻的。 

这是正确的，但复杂性是$$2^k \cdot O(n\log n).$$在最坏的情况下$n=2^k=524288$，这是一个天文数字。 

关键的观察是我们实际上并不关心转换后的数字本身。 我们只关心每个口罩的三个数量：$$\text{minimum value}, \qquad \text{maximum value}, \qquad \text{minimum pair distance}.$$这些量可以沿着数字的位结构递归地合并。 

想到所有$k$- 位数字作为二进制特里树的叶子。 位节点$d$分裂成数字，其$d$-第 位是$0$和数字，其$d$-第 位是$1$。 

当我们决定$d$- 查询掩码的第 位$x$, XOR 要么保持这两半的自然顺序，要么交换它们。 两半之间的相对偏移正好是$2^d$。 

这意味着如果我们已经知道两个孩子的最小变换值、最大变换值和最佳答案，那么我们可以在恒定时间内合并它们。 

对每个位和每个掩码运行此合并都会产生一个$O(k2^k)$解决方案。 递归本质上是超立方体上的分而治之的 DP。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(2^k n\log n)$|$O(n)$| 太慢了 |
 | 最佳 |$O(k2^k)$|$O(2^k)$| 已接受 |

 ## 算法演练

 ### 状态定义

 对于每一个面膜$m$，维持三个值。`mn[m]`是当前可达到的最小变换值。`mx[m]`是当前可达到的最大转换值。`F[m]`是任意两个变换值之间的最小距离。 

最初仅存在原始数组元素。 

对于数组中存在的每个值：```
mn[value] = mx[value] = 0
```对于每个缺失值：```
mn = +INF
mx = -INF
F  = +INF
```### 合并解释

 假设我们正在处理位$d$。 

让```
l = mask with bit d = 0
r = l xor (1<<d)
```表示 trie 节点的两个子节点。 

如果查询位$x_d=0$, 右边的孩子贡献额外的$2^d$。 

如果查询位$x_d=1$，左边的孩子贡献了额外的$2^d$。 

这给出了最小值和最大值的转换：$$mn[l]=\min(mn_l,mn_r+2^d)$$

$$mn[r]=\min(mn_r,mn_l+2^d)$$对于最大值也类似。 

### 计算最佳距离

 最佳一对可以完全位于一个子元素内，也可以使用每个子元素中的一个元素。 

第一个案例已经存储在孩子们中。 

对于交叉对，订购后，可能的最小间隙为$$(\text{minimum right})-(\text{maximum left}).$$在下面$x_d=0$，那就变成$$mn[r]-mx[l]+2^d.$$在下面$x_d=1$，就变成$$mn[l]-mx[r]+2^d.$$我们用这些值最小化答案。 

### 完整程序

 1. 创建数组`mn`,`mx`， 和`F`大小的$2^k$。 
2. 初始化当前数字`mn=mx=0`。 
3. 从低位到高位处理位。 
4. 对于每对仅当前位不同的掩码，合并它们的信息。 
5. 更新`F`使用子答案和跨子候选。 
6. 处理完所有位后，`F[x]`等于 mask 所需的答案`x`。 

### 为什么它有效

 在任何阶段，状态表示在应用已处理的查询位之后特里树子树内的所有数字。`mn`和`mx`描述该子树内的极端变换值。`F`存储完全包含在该子树中的最佳对距离。 

当两个子树合并时，每个有效对都属于三个类别之一：完全在左子树中，完全在右子树中，或者它们之间交叉。 递归明确地取所有三种可能性中的最小值。 

由于每对都被精确地视为包含两个元素的最低节点，因此不会错过任何候选者，也不会引入无效的候选者。 通过对处理后的位进行归纳，最终`F[x]`正是查询掩码的最小对距离`x`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, k = map(int, input().split())
    a = list(map(int, input().split()))

    M = 1 << k
    INF = 10 ** 9

    mn = [INF] * M
    mx = [-INF] * M
    F = [INF] * M

    for x in a:
        mn[x] = 0
        mx[x] = 0

    for d in range(k):
        bit = 1 << d

        for r in range(M):
            if (r >> d) & 1:
                l = r ^ bit

                if F[r] < F[l]:
                    F[l] = F[r]
                elif F[l] < F[r]:
                    F[r] = F[l]

                v = mn[r] - mx[l] + bit
                if v < F[l]:
                    F[l] = v

                v = mn[l] - mx[r] + bit
                if v < F[r]:
                    F[r] = v

                mnl, mnr = mn[l], mn[r]
                mxl, mxr = mx[l], mx[r]

                mn[l] = min(mnl, mnr + bit)
                mn[r] = min(mnr, mnl + bit)

                mx[l] = max(mxl, mxr + bit)
                mx[r] = max(mxr, mxl + bit)

    print(*F)

solve()
```初始化在输入集中存在的每个值处放置一个零长度间隔。 缺席值充当空叶通过`INF`和`-INF`哨兵。 

外循环处理位的方式与二进制 trie 的合并级别完全相同。 每对`(l,r)`对应于两个兄弟子树。 

微妙的部分正在更新`F`覆盖之前`mn`和`mx`。 跨子树距离必须使用旧子树信息。 首先更新极值会破坏重现性。 

另一个细节是答案数组恰好是`F`。 在最终合并级别之后，每个索引对应一个完整的查询掩码。 

## 工作示例

 ### 示例 1

 输入：```
3 3
6 0 3
```初始活动掩码：

 | 面膜| 现在 |
 | ---| ---|
 | 0 | 是的 |
 | 3 | 是的 |
 | 6 | 是的 |

 最终结果：

 | x| f(x) | f(x) |
 | ---| ---|
 | 0 | 3 |
 | 1 | 1 |
 | 2 | 1 |
 | 3 | 2 |
 | 4 | 2 |
 | 5 | 1 |
 | 6 | 1 |
 | 7 | 3 |

 输出：```
3 1 1 2 2 1 1 3
```此示例表明，更改查询掩码可以完全改变哪对变得最佳。 

### 示例 2

 输入：```
3 4
13 4 2
```最终答案：

 | x| f(x) | f(x) |
 | ---| ---|
 | 0 | 2 |
 | 1 | 2 |
 | 2 | 6 |
 | 3 | 6 |
 | ... | ... |

 输出：```
2 2 6 6 3 1 2 2 2 2 1 3 6 6 2 2
```此示例表明答案相对于查询掩码是高度非单调的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(k2^k)$| 每个位都会处理一次所有掩码 |
 | 空间|$O(2^k)$| 三个大小的数组$2^k$|

 和$k\le 19$，我们最多有$524288$面具。 总工作量大约为$19 \cdot 524288$，很容易符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    input = sys.stdin.readline

    def solve():
        n, k = map(int, input().split())
        a = list(map(int, input().split()))

        M = 1 << k
        INF = 10 ** 9

        mn = [INF] * M
        mx = [-INF] * M
        F = [INF] * M

        for x in a:
            mn[x] = 0
            mx[x] = 0

        for d in range(k):
            bit = 1 << d
            for r in range(M):
                if (r >> d) & 1:
                    l = r ^ bit

                    F[l] = min(F[l], F[r])
                    F[r] = min(F[r], F[l])

                    F[l] = min(F[l], mn[r] - mx[l] + bit)
                    F[r] = min(F[r], mn[l] - mx[r] + bit)

                    mnl, mnr = mn[l], mn[r]
                    mxl, mxr = mx[l], mx[r]

                    mn[l] = min(mnl, mnr + bit)
                    mn[r] = min(mnr, mnl + bit)

                    mx[l] = max(mxl, mxr + bit)
                    mx[r] = max(mxr, mxl + bit)

        print(*F)

    solve()
    out = sys.stdout.getvalue()

    sys.stdin = old_stdin
    sys.stdout = old_stdout

    return out

# provided samples
assert run("3 3\n6 0 3\n") == "3 1 1 2 2 1 1 3\n"

assert run("3 4\n13 4 2\n") == \
       "2 2 6 6 3 1 2 2 2 2 1 3 6 6 2 2\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品1 |`3 1 1 2 2 1 1 3`| 基本正确性 |
 | 样品2 | 给定输出| 更大的位宽|
 | 两个相邻的数字 | 所有答案都等于 1 | 最小可能距离 |
 | 全套口罩| 所有答案都等于 1 | 密集输入行为 |
 | 对半的数字 | 可能有大量答案 | 跨子树转换 |

 ## 边缘情况

 考虑：```
2 1
0 1
```对于两个查询掩码，转换后的集合仍然存在`{0,1}`按某种顺序。 答案总是`1`。 

DP 自然地处理这个问题，因为唯一有效的对是最低合并处的交叉子对，产生距离$2^0=1$。 

现在考虑：```
2 3
0 7
```对于每个查询掩码，转换后的值仍然是范围的互补端点。 他们的区别始终是`7`。 

递归通过重复的跨子树合并来计算这一点。 任何子树中不存在更小的候选者，因为每个子树仅包含一个元素。 

最后，考虑 XOR 之后最接近的对发生变化的情况：```
3 3
0 3 6
```在`x=0`，答案是`3`。 

在`x=1`，变换后的值为`1,2,7`，答案就变成了`1`。 

由于 DP 不跟踪特定对，而是跟踪每个子树内所有可能对中的最小值，因此当最佳对发生变化时，它会自动适应。
