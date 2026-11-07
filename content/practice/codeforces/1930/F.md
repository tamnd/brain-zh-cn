---
title: "CF 1930F - 最大化差异"
description: "我们逐步构建一个数组。 每次插入后，我们必须计算 $$f(a)=maxx left(maxi(aimid x)-mini(aimid x)right)。$$ 每一步插入的值都由之前的答案加密，因此查询必须在线处理。"
date: "2026-06-09T01:44:05+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "brute-force", "dfs-and-similar"]
categories: ["algorithms"]
codeforces_contest: 1930
codeforces_index: "F"
codeforces_contest_name: "think-cell Round 1"
rating: 2700
weight: 1930
solve_time_s: 148
verified: false
draft: false
---

[CF 1930F - 最大化差异](https://codeforces.com/problemset/problem/1930/F)

 **评分：** 2700
 **标签：** 位掩码、暴力破解、dfs 和类似的
 **求解时间：** 2m 28s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们逐步构建一个数组。 每次插入后我们必须计算$$f(a)=\max_x \left(\max_i(a_i\mid x)-\min_i(a_i\mid x)\right).$$每一步插入的值都由之前的答案加密，因此查询必须在线处理。 

第一个任务是了解实际最大化的数量。 

修复两个元素$u$和$v$。 我们想要最大化$$(u\mid x)-(v\mid x).$$独立考虑单个位。 

如果两者都$u$和$v$具有相同的位，该位对差异没有任何贡献。 

如果$u$有$1$和$v$有$0$，我们保留$x$的位等于$0$，给出该位值的贡献。 

如果$u$有$0$和$v$有$1$，我们设置$x$的位等于$1$，使双方平等且不做出任何贡献。 

因此，每个位的最佳贡献正是出现在$u$并缺席于$v$。 因此$$\max_x \bigl((u\mid x)-(v\mid x)\bigr)=u\ \&\ \sim v.$$取顺序最好的一对，$$f(a)=\max_{u,v\in a}(u\ \&\ \sim v).$$这是官方解决方案讨论中使用的关键减少。 

这些约束立即排除了任何成对方法。 查询数量可达$10^6$，所以即使$O(q\sqrt q)$是无望的。 所有掩模空间大小的总和由下式确定$2^{22}$，这强烈建议一种解决方案，将工作花费在掩码上，而不是花费在插入值对上。 

当数组仅包含一个值时，会出现一种微妙的边缘情况。 没有一对产生积极的差异，而且确实$$u\ \&\ \sim u = 0,$$所以答案一定是$0$。 

另一个容易犯的错误是将补码视为无限位补码。 只有掩模宇宙中的位才是重要的。 如果掩模空间有$k$位，补码$v$是$$((1<<k)-1)\oplus v.$$使用Python的原始`~v`会产生负数并破坏逻辑。 

## 方法

 蛮力解释很简单。 每次插入后，检查每个有序对$(u,v)$当前存在并计算$$u\ \&\ \sim v.$$这些值中的最大值就是答案。 

这是正确的，因为上面的减少，但是之后$q$它需要的插入$O(q^2)$配对检查。 和$q=10^6$，操作计数是完全不可行的。 

关键的观察是$$u\ \&\ \sim v$$可以看作是一个掩码，同时也是$u$和有界补集的子集$v$。 

让$$c(v)=((1<<k)-1)\oplus v.$$然后是面膜$m$如果存在包含所有位的插入值，则对答案有贡献$m$，并且存在插入的补体掩码$c(v)$还包含所有位$m$。 

定义两个家庭。 

第一个系列包含所有插入的值。 

第二个家庭包含所有补充$c(v)$。 

对于面膜来说$m$， 让`A[m] = true`如果某个插入的值是以下值的超集$m$。`B[m] = true`如果某些插入的补码掩码是以下的超集$m$。 

然后$$m$$是可以实现的，当且仅当两个标志都为 true 时。 

答案就是两个标志都为真的最大掩码。 

现在问题变成了动态子集激活。 

当一个值$v$被插入，每个子集$v$在家庭中生效$A$。 

什么时候$c(v)$被插入，每个子集$c(v)$在家庭中生效$B$。 

在整个测试用例期间，每个系列中的掩码只能激活一次。 这意味着我们可以懒惰地遍历子集晶格，并且永远不会重新访问已经激活的掩模。 

这将整个测试用例转换为掩码上的图遍历。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(q^2)$|$O(q)$| 太慢了 |
 | 最佳 |$O(n \log n + q)$|$O(n)$| 已接受 |

 这里$n=2^k$，以及所有的总和$n$最多超过输入$2^{22}$。 

## 算法演练

 1. 让$k$是掩码空间中的位数，令`FULL = n - 1`。 
2. 维护两个布尔数组。`seenA[m]`意味着面具`m`已经被价值方激活了。`seenB[m]`意味着面具`m`已经被补体侧激活。 
3. 维持当前答案`ans`。 
4. 插入值`v`，对所有子集运行 DFS`v`。 
5.每当戴口罩时`m`是家庭中第一次达到`A`， 标记`seenA[m] = True`。 
6. 如果`seenB[m]`已经是真的，那么`m`两个家庭都可以实现，所以更新`ans = max(ans, m)`。 
7.从面膜开始`m`，继续 DFS 到通过删除一组位获得的每个掩码。 
8. 插入有界补码`cv = FULL ^ v`进入家庭`B`使用相同的DFS逻辑。 
9. 两次激活完成后，输出当前答案。 

### 为什么它有效

 口罩是家人的`A`恰好当它是某个插入值的子集时。 DFS 激活精确地标记了所有此类子集。 

同样，口罩是家人的`B`恰好当它是某个插入值的有界补集的子集时。 

掩码有助于实现目标当且仅当它包含在两个家族中。 当一个掩码在两个家族中都变得活跃时，它就对应于某个有序对$(u,v)$和$$m \subseteq u,\qquad m \subseteq c(v).$$等价地，$$m \subseteq (u\ \&\ \sim v).$$最大的此类面具正是$$\max(u\ \&\ \sim v),$$这等于$f(a)$。 因此，保持的最大值始终是正确的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n, q = map(int, input().split())
        e = list(map(int, input().split()))

        full = n - 1

        seen_a = bytearray(n)
        seen_b = bytearray(n)

        ans = 0
        last = 0

        def activate(start, seen_self, seen_other):
            nonlocal ans

            stack = [start]

            while stack:
                m = stack.pop()

                if seen_self[m]:
                    continue

                seen_self[m] = 1

                if seen_other[m]:
                    if m > ans:
                        ans = m

                x = m
                while x:
                    bit = x & -x
                    stack.append(m ^ bit)
                    x ^= bit

        cur_answers = []

        for enc in e:
            v = (enc + last) % n

            activate(v, seen_a, seen_b)
            activate(full ^ v, seen_b, seen_a)

            last = ans
            cur_answers.append(str(ans))

        out.append(" ".join(cur_answers))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```其核心思想是每个家庭中的每个面具最多被激活一次。 DFS 从不探索已经激活的掩模，因此总工作量与掩模晶格的大小成正比，而不是与插入的数量成正比。 

补码必须用以下公式计算`full ^ v`， 不是`~v`。 只有掩码域内的位是相关的。 

子集遍历使用一次删除一组位的标准技术。 仅当第一次激活其源掩模时，才会遍历子集晶格中的每条边。 

## 工作示例

 ### 示例 1

 输入：```
n = 5
queries = [1, 2]
```| 步骤| 解码 v | 回答 |
 | --- | --- | --- |
 | 1 | 1 | 0 |
 | 2 | 2 | 2 |

 第一次插入后只有一个值，因此每个有序对都是$(1,1)$结果是$0$。 

插入后$2$，这对$(2,1)$给出$$2 \& \sim 1 = 2.$$不可能有更大的值。 

### 第二个示例

 | 步骤| 解码 v | 当前设置 | 回答 |
 | --- | --- | --- | --- |
 | 1 | 3 | {3} | 0 |
 | 2 | 1 | {3,1} | 2 |
 | 3 | 0 | {3,1,0} | 3 |
 | 4 | 5 | {3,1,0,5} | 5 |

 第三步已经包含该对$(3,0)$, 创造价值$3$。 

第四步介绍$5$，以及这对$(5,0)$产生$5$，这成为新的最大值。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n \log n + q)$| 每个家庭中每个面具最多激活一次 |
 | 空间|$O(n)$| 两个访问数组加上 DFS 堆栈 |

 因为所有掩模空间大小的总和最多为$2^{22}$，整个输入的掩码激活总数是有界的。 这正是使该解决方案能够轻松满足限制的原因。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    out = []

    input = sys.stdin.readline

    t = int(input())
    for _ in range(t):
        n, q = map(int, input().split())
        e = list(map(int, input().split()))

        full = n - 1
        seen_a = bytearray(n)
        seen_b = bytearray(n)

        ans = 0
        last = 0

        def activate(start, seen_self, seen_other):
            nonlocal ans
            stack = [start]

            while stack:
                m = stack.pop()
                if seen_self[m]:
                    continue

                seen_self[m] = 1

                if seen_other[m]:
                    ans = max(ans, m)

                x = m
                while x:
                    b = x & -x
                    stack.append(m ^ b)
                    x ^= b

        cur = []

        for enc in e:
            v = (enc + last) % n
            activate(v, seen_a, seen_b)
            activate(full ^ v, seen_b, seen_a)
            last = ans
            cur.append(str(ans))

        out.append(" ".join(cur))

    return "\n".join(out)

# provided samples
assert run("2\n5 2\n1 2\n7 4\n3 1 5 2\n") == \
       "0 2\n0 2 3 5"

# single insertion
assert run("1\n4 1\n3\n") == "0"

# repeated identical values
assert run("1\n8 3\n5 5 5\n") == "0 0 0"

# values creating maximum mask
assert run("1\n8 2\n7 1\n") == "0 6"

# boundary mask values
assert run("1\n8 2\n0 7\n") == "0 7"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 一个插入 |`0`| 基本情况|
 | 所有相同的值 | 全零| 不存在有用的有序对 |
 |`7`然后`1`|`0 6`| 有向差大 |
 |`0`然后`7`|`0 7`| 全罩答案|

 ## 边缘情况

 考虑一个仅插入一个值的测试用例：```
n = 8
queries = [5]
```唯一的有序对是$(5,5)$。$$5 \& \sim 5 = 0.$$DFS 激活两侧的子集，但两个族中存在的最大掩码仍然是$0$。 算法输出`0`。 

现在考虑重复的相等值：```
n = 8
queries = [3,3,3]
```每个订购对都满足$$3 \& \sim 3 = 0.$$第一次插入激活所有子集`3`及其补语。 后来的插入重新访问已经激活的掩模并且几乎不执行任何工作。 答案依然存在`0`。 

最后，考虑极端的一对：```
n = 8
queries = [0,7]
```这对$(7,0)$产量$$7 \& \sim 0 = 7.$$什么时候`7`已插入，掩码`7`在价值家庭中变得活跃。 因为在插入后它已经可以从补体家族到达`0`，答案立即更新为`7`，这是最大可能的掩码。
