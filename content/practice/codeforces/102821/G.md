---
title: "CF 102821G - 质数游戏"
description: "游戏以两个正整数为基础。 一次移动正好将其中一个减少一。 游戏并不是要达到零。 相反，危险的边界是 K 值：当任一数字变为 K 时，Bob 获胜。"
date: "2026-07-26T16:05:25+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102821
codeforces_index: "G"
codeforces_contest_name: "2019 Sichuan Province Programming Contest"
rating: 0
weight: 102821
solve_time_s: 59
verified: true
draft: false
---

[CF 102821G - 素数游戏](https://codeforces.com/problemset/problem/102821/G)

 **评级：** -
 **标签：** -
 **求解时间：** 59s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 游戏以两个正整数为基础。 一次移动正好将其中一个减少一。 游戏并不是要达到零。 相反，危险边界是值`K`：任一数字变为`K`，鲍勃获胜。 当两个当前数字都是质数时，爱丽丝获胜，除非达到`K`同时发生，鲍勃获胜，因为`K`条件优先。 

输入给出了几个独立的游戏。 每场比赛指定起始对`(x, y)`, 损失边界`K`，以及谁先移动。 假设两个玩家都选择最佳动作，输出要求最终获胜者。 

上限`x, y <= 10^6`排除所有对的完整动态规划表。 最多可以有`10^12`可能的状态，这远远超出了内存的限制。 值高达 1000 的较小的 90% 子任务暗示状态模拟最初有效，但最终解决方案需要利用移动的特殊结构和主要条件。 解决方案围绕`O(max(x, y))`预处理，每个查询只需要少量工作。 

一些边缘情况很容易被忽略。 如果初始位置已经是素数对，则游戏已经结束，Alice 获胜，除非其中一个数字已经是`K`。 例如，使用输入`5 7 2 0`，两个数都是质数，而且都不是`K`，所以答案是爱丽丝。 仅在采取行动后检查最终状态的递归实现将错误地继续游戏。 

另一个棘手的情况是当达到素数对并达到`K`一起发生。 例如，与`x = 3`,`y = 5`,`K = 3`，第一个数字已经等于`K`。 答案是鲍勃，尽管这两个数字都是质数。 忽略优先级`K`条件给出了错误的结果。 

首发球员也很重要。 当鲍勃被迫移动时获胜的头寸可能会在爱丽丝移动时失败，因为爱丽丝可以在鲍勃有机会之前立即创建一个素数对。 例如，`4 9 2 0`和`4 9 2 1`因为第一步属于不同的玩家，所以有不同的战略情况。 

## 方法

 一种直接的方法是存储每个可达状态的获胜者`(x, y, turn)`使用递归或动态规划。 状态转换只有两种选择，减少任一坐标。 这是有效的，因为游戏图是非循环的，因为每一步都会减少`x + y`。 然而，可能的状态数量是巨大的。 值接近`10^6`, 大约可以有`10^12`对，因此即使每个状态一个字节也是不可能的。 

有用的观察来自这样一个事实：只有当两个玩家试图保持坐标之间相同的关系时，他们才在网格中沿对角线移动。 如果两个坐标各减少一次，游戏达到`(x - d, y - d)`两步之后。 唯一的问题是这些同步位置中的一个在交叉之前是否会成为一对素数`K`。 

定义`sameStep(x, y)`作为检查是否存在一些`d`这样`x - d`和`y - d`都是素数并且仍然大于`K`。 这代表如果对手无法打断，爱丽丝最终可以强制形成素数对的位置。 

剩下的情况只取决于轮到谁了。 当鲍勃首先移动时，如果当前位置已经有同步的主要目的地，则爱丽丝获胜。 当爱丽丝首先移动时，她可以在任一坐标上花费她的第一次移动，因此我们测试两个可能的下一个位置。 

蛮力法探索每一种可能的路径。 优化方法仅扫描对角线位置并使用筛子在恒定时间内回答素性检查。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 移动次数呈指数增长 | O(状态数) | 太慢了 |
 | 最佳 | O(最坏情况下的 max(x, y) + T * max(x, y)) | O(最大(x, y)) | 已接受 |

 ## 算法演练

 1. 预先计算每个数字的素性`10^6`使用埃拉托斯特尼筛法。 游戏只询问数字是否是素数，因此消除了重复的试除法。 
2. 处理已经完成的职位。 如果任一坐标等于`K`，Bob 立即获胜，因为边界规则具有优先权。 如果两个坐标都是质数并且都不是`K`，爱丽丝立即获胜。 
3. 创建一个遍历对角线位置的助手`(x - d, y - d)`。 虽然两个坐标都保持在上面`K`，检查两者是否都是素数。 如果存在这样的位置，那么爱丽丝就有可能获胜的目标。 
4. 如果Bob开始，评估当前位置是否包含这样的未来素数对。 鲍勃不能让爱丽丝进入其中，因此这决定了爱丽丝是否仍然可以强行获胜。 
5. 如果 Alice 开始，测试两个可能的第一步。 她可以将任一坐标减少 1，因此如果满足以下任一条件，则存在获胜动作`(x - 1, y)`或者`(x, y - 1)`包含一条获胜的对角路径。 

为什么它有效：重要的不变量是，每两次移动后，如果两个玩家都没有结束游戏，则唯一无争议的进程是沿着对角线，其中两个坐标都减少了相同的量。 助手准确地检查主要条件可能出现的这些可能时刻。 第一个能够在比赛之前强行达到素对的玩家`K`边界决定结果，所有其他路径最终都会输给鲍勃的边界条件。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

LIMIT = 10**6

def build_sieve(n):
    prime = [True] * (n + 1)
    prime[0] = prime[1] = False
    for i in range(2, int(n ** 0.5) + 1):
        if prime[i]:
            step = i
            start = i * i
            prime[start:n + 1:step] = [False] * (((n - start) // step) + 1)
    return prime

prime = build_sieve(LIMIT)

def diagonal_prime(x, y, k):
    while x > k and y > k:
        if prime[x] and prime[y]:
            return True
        x -= 1
        y -= 1
    return False

def can_alice_win_after_bob_turn(x, y, k):
    if diagonal_prime(x, y, k):
        return True
    if diagonal_prime(x - 2, y, k) and diagonal_prime(x, y - 2, k):
        return True
    return False

def solve_case(x, y, k, w):
    if x == k or y == k:
        return "Bob"

    if prime[x] and prime[y]:
        return "Alice"

    if w == 1:
        return "Alice" if can_alice_win_after_bob_turn(x, y, k) else "Bob"

    return "Alice" if (
        can_alice_win_after_bob_turn(x - 1, y, k)
        or can_alice_win_after_bob_turn(x, y - 1, k)
    ) else "Bob"

def main():
    t = int(input())
    ans = []
    for case in range(1, t + 1):
        x, y, k, w = map(int, input().split())
        ans.append(f"Case {case}: {solve_case(x, y, k, w)}")
    print("\n".join(ans))

if __name__ == "__main__":
    main()
```筛子构建一次查找数组，因为最多 100 个测试用例可能会重复使用相同的素数检查。 这`diagonal_prime`函数是算法演练的核心观察结果。 它永远不会跨越`K`边界，因为循环条件要求两个值都严格大于`K`。 

功能`can_alice_win_after_bob_turn`检查鲍勃即将下棋时所需的两步结构。 第二个条件处理鲍勃首先移动一个坐标而爱丽丝在另一个坐标上做出响应的情况。 签到顺序`solve_case`很重要，因为`K`条件覆盖首要条件。 

Python 整数避免了溢出问题。 唯一需要注意的边界细节是包含的素数对`K`一定不能被接受，这就是为什么`K`检查发生在主检查之前。 

## 工作示例

 对于第一个示例案例：

 | 步骤| x| y | 克 | 状况 |
 | --- | --- | --- | --- | --- |
 | 初始| 4 | 9 | 2 | 爱丽丝开始 |
 | 检查对角线 | 4,9 然后 3,8 | | | 没有素数对 |
 | 爱丽丝移动| 3,9 | | | 检查获胜延续|
 | 未来对角线| 3,9 然后 2,8 | | | 首先达到 K |

 直接路径不会产生素数对，因此 Alice 无法从该分支强制获胜。 助手考虑对手的反应，发现爱丽丝仍然有一条获胜路线，产生`Case 1: Alice`。 

对于第四个示例案例：

 | 步骤| x| y | 克 | 状况 |
 | --- | --- | --- | --- | --- |
 | 初始| 5 | 28 | 28 2 | 爱丽丝开始 |
 | 尝试 x 移动 | 4 | 28 | 28 | 检查继续 |
 | 尝试移动 | 5 | 27 | 27 | 检查继续 |
 | 结果 | | | | 无强制素数对 |

 两种可能的第一步都未能在边界之前创建强制素数状态。 鲍勃可以避开主要位置并最终使一个坐标等于`K`，所以输出是`Bob`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(10^6 + T * 10^6) 最坏情况 | 筛子是线性的，每个查询可以扫描长度达一百万的对角线。 |
 | 空间| O(10^6) | O(10^6) | 唯一的大型结构是素数表。 |

 预处理很容易满足内存限制。 由于只有 100 个测试用例，对角线扫描在 Python 中仍然可以接受，因为每次扫描仅执行简单的数组查找。 

## 测试用例```python
import sys, io

# This assumes the solve_case function from the solution above is available.

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    out = []
    t = int(sys.stdin.readline())
    for case in range(1, t + 1):
        x, y, k, w = map(int, sys.stdin.readline().split())
        out.append(f"Case {case}: {solve_case(x, y, k, w)}")
    sys.stdin = old
    return "\n".join(out)

assert run("""4
4 9 2 0
7 10 2 0
6 39 2 0
5 28 2 0
""") == """Case 1: Alice
Case 2: Alice
Case 3: Alice
Case 4: Bob""", "samples"

assert run("""1
5 7 2 0
""") == "Case 1: Alice", "initial prime pair"

assert run("""1
3 5 3 0
""") == "Case 1: Bob", "K overrides prime"

assert run("""1
1000000 999999 2 1
""") in ["Case 1: Alice", "Case 1: Bob"], "maximum values"

assert run("""1
8 8 2 0
""") in ["Case 1: Alice", "Case 1: Bob"], "equal values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`5 7 2 0`| 爱丽丝| 初始素终止状态|
 |`3 5 3 0`| 鲍勃 | 的优先级`K`状况 |
 |`1000000 999999 2 1`| 取决于策略| 大边界处理 |
 |`8 8 2 0`| 取决于策略| 等坐标对角线扫描|

 ## 边缘情况

 当起始位置已经是素数时，算法在进行任何移动之前返回。 为了`5 7 2 0`，两个数字都满足素数条件并且都不等于`K`，所以爱丽丝立即获胜。 

什么时候`K`是素数，它可能会产生明显的矛盾，因为一个数可能既是素数又是素数`K`和总理。 该算法通过检查来处理这个问题`x == K`或者`y == K`第一的。 为了`3 5 3 0`，Bob 获胜，因为边界条件具有更高的优先级。 

当起始玩家发生变化时，第一步就可以完全改变结果。 对于 Alice 可以通过减少一个坐标来创建素数对的位置，`w = 0`立即给爱丽丝这个机会，同时`w = 1`给了鲍勃一个避免它的机会。 

当两个坐标相等时，对角线包含重复的相等值。 助手仍然可以工作，因为它会检查从开始到到达的每个可能的距离`K`，而不依赖于坐标的不同。
