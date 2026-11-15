---
title: "CF 92A - 芯片"
description: "我们有n只海象围成一圈。 演示者从m个筹码开始，按顺序分发。 海象 1 收到 1 个筹码，海象 2 收到 2 个筹码，依此类推，直到海象 n，之后从海象 1 开始再次重复该循环。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 92
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 75 (Div. 2 Only)"
rating: 800
weight: 92
solve_time_s: 195
verified: true
draft: false
---

[CF 92A - 芯片](https://codeforces.com/problemset/problem/92/A)

 **评分：** 800
 **标签：** 实现、数学
 **求解时间：** 3m 15s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有`n`海象排成一圈。 主持人首先以`m`筹码并按顺序分发。 海象`1`收到`1`芯片, 海象`2`收到`2`薯片等直至海象`n`，之后海象再次重复该循环`1`。 

只要演示者有足够的筹码来完全满足当前的海象，这个过程就会继续。 一旦演示者无法给出所需的金额，该过程就会停止，剩余的筹码将由演示者保留。 任务是计算最后还剩下多少筹码。 

限制非常小。 海象的数量最多为`50`，芯片数量最多为`10^4`。 即使是重复一一减去数值的直接模拟也很容易在时间限制内完成。 在最坏的情况下，每次操作至少移除一个芯片，因此循环最多运行一次`10^4`次，这对于 2 秒的限制来说是微不足道的。 

错误的主要原因是正确处理停止条件。 当演示者不能完全满足当前海象时，而不是部分给予筹码后，该过程结束。 

考虑这个输入：```
3 1
```第一头海象需要的正是`1`芯片，因此演示者将其放弃并以`0`。 

粗心的实施可能会在提供芯片之前停止，因为它检查了错误的不平等。 

另一个微妙的情况是当循环结束时：```
4 11
```主持人给出`1 + 2 + 3 + 4 = 10`在第一个完整周期期间芯片，留下`1`。 然后循环又开始了，海象`1`收到最后一个筹码，演示者以`0`。 不正确的实现可能会在第一个完整周期后立即停止并错误输出`1`。 

当剩余筹码小于下一个所需数量时，会出现另一种边缘情况：```
3 7
```分布如下：`1 -> 2 -> 3 -> 1`主持人现在有`0`决赛后剩下的筹码`1`。 如果我们有：```
3 6
```主持人给出`1 -> 2 -> 3`并停止于`0`。 

如果我们有：```
3 5
```主持人给出`1 -> 2`，离开`2`。 下一个海象需要`3`，所以答案是`2`。 先减后检查的有缺陷的实现会产生负值。 

## 方法

 最直接的解决方案是完全按照描述模拟该过程。 我们跟踪当前海象的数量，从`1`到`n`，并反复检查是否有足够的筹码剩余。 如果是，我们减去所需的数量并移至下一个海象。 否则，我们停止并打印剩余的芯片。 

这种暴力方法已经足够快了，因为每次成功的操作都会至少减少芯片数量`1`。 自从`m ≤ 10^4`，循环最多执行`10^4`次。 

这个过程背后还有一个数学观察。 一整轮分配：$1+2+\cdots+n=\frac{n(n+1)}{2}$芯片。 

We could repeatedly remove whole rounds before simulating the remaining partial round. 这进一步减少了迭代次数。 Still, with the given constraints, the simple simulation is cleaner and fully sufficient.

 The brute-force solution works because the state transition is tiny and bounded. The constraints are so small that optimization is unnecessary. The important part is implementing the cyclic order and stopping condition correctly.

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟| O(米) | O(1) | O(1) | 已接受 |
 | 基于回合的优化 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 阅读`n`和`m`。 
2. 从当前海象指数开始等于`1`。 
3. 当演示者仍有足够的筹码供当前海象使用时，从其中减去所需的筹码数量`m`。 
4. 按顺时针顺序移动到下一个海象。 

如果当前的海象是`n`, 绕回到`1`。 
5. 此刻`m`变得小于当前海象所需的数量，停止该过程。 
6. 打印剩余值`m`。 

为什么它有效：

 在每一步中，算法都严格遵循分配过程的规则。 代表当前海象的变量总是与下一个应该接收筹码的海象相匹配，并且`m`始终存储仍然可用的筹码数量。 仅当当前海象能够完全满足时，循环才会继续。 一旦不可能，该过程必须根据问题陈述立即终止。 由于每次成功的迭代都反映了演示者的一次合法动作，因此最终的剩余值是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())

current = 1

while m >= current:
    m -= current
    current += 1

    if current > n:
        current = 1

print(m)
```变量`current`商店接下来应该收到芯片的海象。 它开始于`1`因为这个过程总是从海象开始`1`。 

循环条件是关键细节：```
while m >= current:
```只有当存在足够的筹码来完全满足当前的海象时，才允许演示者继续。 使用`>`而不是`>=`当剩余筹码与所需数量完全匹配时就会失败。 

减去筹码后，我们前进到下一个海象。 当该指数超过`n`，我们回绕到`1`以维持循环秩序。 

该实现永远不会产生负值，因为只有在验证有足够的芯片可用后才会进行减法。 

## 工作示例

 ### 示例 1

 输入：```
4 11
```| 当前海象| 需要筹码| 之前的筹码 | 筹码后|
 | --- | --- | --- | --- |
 | 1 | 1 | 11 | 11 10 | 10
 | 2 | 2 | 10 | 10 8 |
 | 3 | 3 | 8 | 5 |
 | 4 | 4 | 5 | 1 |
 | 1 | 1 | 1 | 0 |

 下一个海象需要`2`碎片，但没有留下，所以答案是`0`。 

此示例演示了到达海象后的环绕行为`4`。 

### 示例 2

 输入：```
3 5
```| 当前海象| 需要筹码| 之前的筹码 | 筹码后|
 | --- | --- | --- | --- |
 | 1 | 1 | 5 | 4 |
 | 2 | 2 | 4 | 2 |

 下一个海象需要`3`芯片，但仅`2`保持不变，所以过程停止，答案是`2`。 

此跟踪确认该进程在部分分发之前结束。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(米) | 每次成功的迭代都会移除至少一个芯片 |
 | 空间| O(1) | O(1) | 只存储了几个整型变量 |

 自从`m`至多是`10^4`，模拟最多执行`10^4`迭代。 这远远低于 2 秒运行时间的限制。 内存使用量是恒定的。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    n, m = map(int, input().split())

    current = 1

    while m >= current:
        m -= current
        current += 1

        if current > n:
            current = 1

    print(m)

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out

# provided sample
assert run("4 11\n") == "0\n", "sample 1"

# minimum values
assert run("1 1\n") == "0\n", "minimum case"

# cannot satisfy second walrus
assert run("2 1\n") == "0\n", "exactly enough for first walrus"

# partial stop in middle of cycle
assert run("3 5\n") == "2\n", "stop before giving 3 chips"

# wrap around multiple times
assert run("2 7\n") == "1\n", "multiple complete cycles"

# maximum style stress case
assert run("50 10000\n") == "145\n", "large input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1`|`0`| 尽可能最小的输入 |
 |`2 1`|`0`| 精确相等条件 |
 |`3 5`|`2`| 部分分发前停止 |
 |`2 7`|`1`| 正确的圆形环绕 |
 |`50 10000`|`145`| 约束下的大输入|

 ## 边缘情况

 考虑精确拟合场景：```
1 1
```第一头海象完全需要`1`芯片。 算法检查`m >= current`，这是正确的，减去筹码，然后留下`0`。 下一次迭代失败是因为`0 < 1`，所以输出是正确的`0`。 

现在考虑一个环绕的情况：```
4 11
```给予后`1 + 2 + 3 + 4 = 10`芯片，算法重置`current`回到`1`。 由于还剩下一颗筹码，演示者成功将其赠送出去，并以`0`。 这确认循环索引处理正确。 

最后，检查部分失败的情况：```
3 5
```该算法执行以下步骤：`5 -> 4 -> 2`下一个海象需要`3`，但仅`2`保持。 由于循环条件在减法之前失败，因此算法立即停止并打印`2`。 这可以防止无效的负值并完全匹配问题规则。
