---
problem: 1370C
contest_id: 1370
problem_index: C
name: "Number Game"
contest_name: "Codeforces Round 651 (Div. 2)"
rating: 1400
tags: ["games", "math", "number theory"]
answer: passed_samples
verified: true
solve_time_s: 243
date: 2026-06-14
model: gpt-5-5
samples_passed: 1
samples_total: 1
share_url: https://chatgpt.com/share/6a2e52c3-f374-83ec-8a3c-fb04c12ded07
---

# CF 1370C - 数字游戏

 **评分：** 1400
 **标签：** 游戏、数学、数论
 **型号：** gpt-5-5
 **求解时间：** 4m 3s
 **已验证：** 是（1/1 样品）
 **分享：** https://chatgpt.com/share/6a2e52c3-f374-83ec-8a3c-fb04c12ded07

 ---

 ## 解决方案

 ## 问题理解

 我们正在玩一个两人回合制游戏，从一个整数开始。 在每次移动中，当前玩家都会使用两种操作之一来转换数字：要么从中减一，要么除以某个大于一的奇数除数。 除数实际上必须除当前数字，并且除数包括数字本身，因此当数字大于 1 时始终允许除以完整数字。 

当玩家无法进行任何移动时，游戏就结束了，这种情况只有在数字变为 1 时才会发生。无论谁面临这种情况，都将立即失败，因为不再可能进行减法或除法。 

任务是确定对于 n 的每个起始值，假设双方都处于最佳发挥，第一个玩家是否强制获胜。 

约束允许 n 最多为 10^9 和最多 100 个测试用例。 这立即排除了对所有可达数字的任何状态空间搜索。 即使对最多 n 的所有状态进行简单的动态规划也是不可能的，因为 n 太大。 任何解决方案都必须将问题简化为一些算术检查和数字的结构属性。 

一个天真的但常见的陷阱是假设游戏仅取决于奇偶性或仅取决于达到 1 所需的步数。例如，认为“奇数总是好的”的想法会立即失败，因为 n = 9 和 n = 3 的行为不同：3 获胜，但由于多个除数，9 在最佳游戏下表现不同。 另一个微妙的失败案例是将减法视为始终占主导地位的。 实际上，除以奇数因子可以跳过状态空间的大部分并完全改变奇偶校验推理。 

## 方法

 暴力方法会尝试将游戏模拟为所有可能移动的递归极小极大。 从给定的 n 开始，对于每个奇数除数 d > 1，我们分支到所有状态 n - 1 和 n / d。这定义了直至 n 的整数上的博弈图。 尽管每个状态只有 O(sqrt n) 个除数，但递归深度可以是 O(n)，并且重复状态以复杂的方式出现。 在最坏的情况下，这会导致指数探索，即使 n 小到 10^9，这也是不可行的。 

关键的观察是，有效动作的结构将几乎所有情况分解为少数算术类别。 奇数的行为方式非常简单，因为任何奇数合数都有一个大于 1 的奇数除数，可以立即将其减少到更小的奇数。 偶数的表现有所不同，具体取决于它们包含多少个 2 的因数。 唯一真正棘手的位置是当数字是 2 的幂时，因为它没有大于 1 的奇数除数，迫使游戏表现得像一个简单的递减链。 当 n 是奇素数的两倍时，就会出现另一种特殊的结构，其中除法创建的素数状态的行为与一般偶数不同。 

最终的解决方案将整个游戏简化为在每个测试用例的恒定时间内检查一些结构用例。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力极小极大 | 指数| O(n) 递归状态 | 太慢了|
 | 结构案例分析| O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

1. 如果n等于1，则第一个玩家没有动作并立即失败。 这是游戏中唯一的终点位置。 
2. 如果n等于2，唯一的动作就是减1，这样对手就剩下1，保证第一个玩家获胜。 
3. 如果n是奇数并且大于1，则第一个玩家总是可以除以n本身，因为n是大于1的奇数除数。这一步将游戏直接带到1，强制获胜。 
4. 如果 n 为偶数，则将其分解为 n = 2^k * m，其中 m 为奇数。 该行为取决于 k 以及 m 是否等于 1。 
5. 如果 n 是 2 的幂 (m = 1)，则每次移动都被迫重复减一，因此结果完全取决于 k 的奇偶性。 在这种情况下，当 k > 1 时，第一个玩家就会失败，因为他们最终会交出较小的 2 的幂，在失败的配置中，该幂仍然是偶数，但更接近 1。 
6. 如果 n 恰好有 2 的一个因数 (k = 1)，则 n = 2 * m。 如果 m 是素数，第二个玩家总是可以以保留获胜结构的方式做出反应，从而使第一个玩家处于失败的位置。 如果 m 是合数，则第一个玩家可以除以奇数因子以强制较小的偶数状态并获得控制。 

决定性的见解是，每个头寸都会减少为立即获胜（奇数 n > 1）、微不足道的获胜（n = 2）或偶数无法有利地打破的结构化失败情况。 唯一重要的结构是 2 因式分解如何与奇数除数的可用性相互作用。 

### 为什么它有效

 游戏完全取决于玩家可以减少数字奇数部分的程度以及任何分支移动是否可以避免给对手一个干净的递减链。 奇数总是会让对手失去位置，因为它们包含着向 1 的自我毁灭性举动。偶数只有在将奇数除数限制为单个质因数时才是危险的，迫使游戏进入线性倒计时。 这将整个状态图折叠成一小组等价类，确保不存在隐藏的较长循环。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def is_prime(x):
    if x < 2:
        return False
    if x % 2 == 0:
        return x == 2
    i = 3
    while i * i <= x:
        if x % i == 0:
            return False
        i += 2
    return True

t = int(input())
for _ in range(t):
    n = int(input())

    if n == 1:
        print("FastestFinger")
    elif n == 2:
        print("Ashishgup")
    elif n % 2 == 1:
        print("Ashishgup")
    else:
        # n is even and > 2
        # check if power of two
        if (n & (n - 1)) == 0:
            print("FastestFinger")
        else:
            # remove factor 2
            m = n
            while m % 2 == 0:
                m //= 2

            # if odd part is 1 => power of two already handled, so safe
            if m == 1:
                print("FastestFinger")
            else:
                # if m is prime AND n has no extra structure
                if is_prime(m) and n // m == 2:
                    print("FastestFinger")
                else:
                    print("Ashishgup")
```该代码首先隔离了简单的终端情况：n 等于 1 且 n 等于 2。之后，所有奇数都会立即获胜，因为除以数字本身始终是合法的并结束游戏。 

对于偶数，位技巧`(n & (n - 1)) == 0`检测 2 的纯幂，由于游戏退化为重复减法，直到在强制游戏下达到 1，因此它们会失去位置。 如果该数字不是 2 的幂，我们提取其奇数分量 m。 

关键区别在于 m 是否为素数以及该数是否恰好是该素数的 2 倍。 这种配置可以防止第一个玩家进行任何有益的奇数除数移动，从而将游戏锁定在失败的结构中。 

## 工作示例

 我们从样本集中追踪两个有代表性的输入。 

### 示例 1

 输入：n = 6

 | 步骤| n | 类型 | 移动| 结果 n |
 | --- | --- | --- | --- | --- |
 | 1 | 6 | 均匀复合| 除以 3 | 2 |
 | 2 | 2 | 基本情况| 减 1 | 1 |
 | 3 | 1 | 终端| 无 | 当前玩家输了 |

 这表明第一个玩家强制减少到 2，然后对手被迫落入失败的棋步。 关键是奇数除数3的存在。 

### 示例 2

 输入：n = 4

 | 步骤| n | 类型 | 移动| 结果 n |
 | --- | --- | --- | --- | --- |
 | 1 | 4 | 两个的幂| 减 1 | 3 |
 | 2 | 3 | 奇素数| 除以 3 | 1 |
 | 3 | 1 | 终端| 无 | 先前玩家的损失 |

 在这里，第一个玩家无法避免给对手一个获胜的回应。 无论减法还是强行结构，第二个玩家总能强行获胜。 

6 和 4 之间的对比凸显出并非所有偶数的行为都相同； 可分结构比大小更重要。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每次测试最坏情况为 O(sqrt n) | 奇数分量的素性和因子提取 |
 | 空间| O(1) | O(1) | 只有常量额外变量 |

 这些约束允许最多 100 个测试用例，其中 n 最多为 10^9，因此即使是 sqrt(n) 检查在 Python 中也足够快。 所有其他操作都是恒定时间位或算术检查，使解决方案保持在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    def is_prime(x):
        if x < 2:
            return False
        if x % 2 == 0:
            return x == 2
        i = 3
        while i * i <= x:
            if x % i == 0:
                return False
            i += 2
        return True

    t = int(input())
    out = []
    for _ in range(t):
        n = int(input())
        if n == 1:
            out.append("FastestFinger")
        elif n == 2:
            out.append("Ashishgup")
        elif n % 2 == 1:
            out.append("Ashishgup")
        else:
            if (n & (n - 1)) == 0:
                out.append("FastestFinger")
            else:
                m = n
                while m % 2 == 0:
                    m //= 2
                if m == 1:
                    out.append("FastestFinger")
                elif is_prime(m) and n // m == 2:
                    out.append("FastestFinger")
                else:
                    out.append("Ashishgup")
    return "\n".join(out)

# provided samples
assert run("7\n1\n2\n3\n4\n5\n6\n12\n") == "FastestFinger\nAshishgup\nAshishgup\nFastestFinger\nAshishgup\nFastestFinger\nAshishgup"

# custom cases
assert run("1\n1\n") == "FastestFinger", "minimum case"
assert run("1\n2\n") == "Ashishgup", "small win"
assert run("1\n8\n") == "FastestFinger", "power of two losing chain"
assert run("1\n9\n") == "Ashishgup", "odd composite immediate win"
assert run("1\n18\n") == "Ashishgup", "even composite structure"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 | 最快的手指 | 终端丢失状态|
 | 2 | 阿什什古普 | 最小胜诉案例|
 | 8 | 最快的手指 | 两种行为的力量|
 | 9 | 阿什什古普 | 奇数复合立即获胜|
 | 18 | 18 阿什什古普 | 复合均匀处理|

 ## 边缘情况

 对于 n = 1，算法立即将其归类为失败，因为不存在任何移动。 输出是FastestFinger，它符合移动的玩家在卡住时失败的规则。 

对于 n = 2，代码将其视为特殊的获胜案例。 唯一的举动是减法，这迫使对手 n = 1，确保获胜。 

对于 n = 8，该值是 2 的纯幂。 位检查`(n & (n - 1)) == 0`触发，将其发送到失败类别。 原因是不存在奇数除数，因此游戏退化为强制减法。 

对于 n = 9，它是奇数且大于 1，因此第一个玩家立即除以 9，一步获胜，与分类匹配。 

对于 n = 18，该数字是偶数，但不是 2 的纯幂，其奇数部分是 9，是合数。 该算法将其识别为获胜位置，因为存在有益的奇数除数，允许第一个玩家强制减少对手的失败结构。
