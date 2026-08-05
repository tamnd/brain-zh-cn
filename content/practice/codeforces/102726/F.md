---
title: "CF 102726F - 缩放练习"
description: "游戏在几轮俯卧撑中独立进行。 每轮都以多次俯卧撑开始。 在一轮中，玩家用其真因数之一替换当前数字。 选择 1 的玩家将立即输掉该回合。"
date: "2026-08-01T22:13:40+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102726
codeforces_index: "F"
codeforces_contest_name: "UTPC Contest 9-11-20 Div. 1"
rating: 0
weight: 102726
solve_time_s: 80
verified: true
draft: false
---

[CF 102726F - 缩放练习](https://codeforces.com/problemset/problem/102726/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 20s
 **已验证：** 是的

 ## 解决方案
 # 问题理解

 游戏在几轮俯卧撑中独立进行。 每轮都以多次俯卧撑开始。 在一轮中，玩家用其真因数之一替换当前数字。 选择 1 的玩家将立即输掉该回合。 双方玩家都选择最优的走法。 如果菲奥娜赢了一轮，伊利亚将支付原来俯卧撑次数的两倍，而如果伊利亚赢了，他就无需支付任何费用。 任务是计算 Elijah 在所有回合后的俯卧撑总数。 

输入包含轮数，后跟每轮的起始值。 输出是每场最优游戏结束后 Elijah 收到的总惩罚。 

重要的限制是每个起始数字可以大到$10^{11}$，最多可以有 100 轮。 试除到平方根大约需要$10^6$在最坏的情况下检查每个数字，这已经存在了$10^8$所有回合的操作。 在 Python 中，这已经接近极限，几乎没有留下任何开销空间。 需要更快的素性测试。 

游戏结构比最初看起来要简单得多。 我们需要的唯一数学属性是一个数是否是素数。 粗心的解决方案可能会尝试模拟每个可能的除数移动，但数字可能有许多除数，并且游戏树不是探索的正确对象。 

第一个边缘情况是主要起始值。 例如：```
1
7
```正确的输出是：```
14
```The only divisor smaller than 7 is 1. Fiona, moving first, must choose 1 and immediately loses. 既然以利亚赢了，他就付0？ Wait, the game rule says the player who replaces the number with 1 loses, so the first player losing means Fiona loses only if Fiona starts. However, Elijah starts every round, so a prime number is a losing position for Elijah. The correct output is 14 because Fiona wins and Elijah pays twice 7.

 第二个边缘情况是合数：```
1
12
```正确的输出是：```
0
```粗心的方法可能会认为许多除数使游戏变得复杂，但 Elijah 总是可以移动到质因数，例如 3。这使得 Fiona 剩下一个质数，而她没有获胜的举动。 每个合数都为第一个玩家提供了这个选项。 

第三种边缘情况是最小的可能值：```
1
2
```正确的输出是：```
4
```数字 2 是素数，因此根据上述推理，以利亚立即失败。 将 2 视为特殊的类似复合情况的实现将产生错误的答案。 

## 方法

 直接的方法是生成每个数字的每个除数，并递归地确定某个位置是否获胜。 这是有效的，因为游戏是有限的。 每一步都会减少当前值，因此最终有人会强制移动到 1。递归游戏搜索将正确地对每个位置进行分类。 

问题是这些值可以达到$10^{11}$。 即使重复找到所有除数也是不必要的工作，并且递归状态空间变得难以管理。 当在所有测试用例中重复时，最坏情况除数枚举已经变得过于昂贵。 

关键的观察是每个合数都有一个小于其自身的素因数。 如果当前数字是合数，则第一个玩家可以用该质因数替换它。 然后对手被迫陷入失败的有利位置。 另一方面，如果当前数字是素数，则唯一合法的替换是 1，它会立即失败。 

因此，整个游戏归结为一个问题：起始数是素数吗？ 质数贡献$2a_i$俯卧撑，而合数贡献为零。 

处理高达$10^{11}$，确定性 Miller-Rabin 素性测试就足够了。 通过一小部分固定的基数，它可以给出该范围的精确答案，而无需检查每个可能的除数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 过于依赖除数和游戏状态的数量 | O(状态数) | 太慢了|
 | 最佳 | O(n log^3(max(a))) | O(n log^3(max(a))) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 对于每个俯卧撑量，使用 Miller-Rabin 素性测试确定其是否为素数。 游戏需要的唯一信息是起始位置是赢还是输，这完全由素性决定。 
2. 如果该数字是素数，则将其值的两倍添加到答案中。 质数是第一个玩家的失败位置，因此菲奥娜赢得了这一轮。 
3. 如果该数是合数，则不添加任何内容。 以利亚可以移动到素因数并迫使菲奥娜陷入失败的境地。 

为什么它有效：

 素数除了它本身和 1 之外没有除数。由于用 1 替换该数字会立即失败，因此第一个玩家没有安全的移动并失败。 合数的质因数小于它本身。 第一个玩家选择该除数，给对手留下一个素数。 那么对手就输了。 这两种情况涵盖了所有大于 1 的整数，因此算法始终会分配正确的获胜者。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def is_prime(n):
    if n < 2:
        return False

    small = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]
    for p in small:
        if n == p:
            return True
        if n % p == 0:
            return False

    d = n - 1
    s = 0
    while d % 2 == 0:
        s += 1
        d //= 2

    for a in [2, 3, 5, 7, 11]:
        if a >= n:
            continue
        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue

        ok = False
        for _ in range(s - 1):
            x = x * x % n
            if x == n - 1:
                ok = True
                break

        if not ok:
            return False

    return True

def solve():
    n = int(input())
    ans = 0

    for _ in range(n):
        a = int(input())
        if is_prime(a):
            ans += 2 * a

    print(ans)

if __name__ == "__main__":
    solve()
```这`is_prime`函数首先删除小的质因数。 这可以快速处理许多复合值并避免不必要的 Miller-Rabin 工作。 

对于剩余的值，该数字写为$d \times 2^s$。 Miller-Rabin 检查一个数字在多个模幂测试下是否表现得像素数。 所选择的基数对于输入范围是确定性的，因此不存在概率误差。 

主循环只需对每个起始数进行分类即可。 它添加了`2 * a`仅用于损失头寸。 Python 整数已经支持大于最大可能答案的值，因此不需要溢出处理。 

## 工作示例

 对于第一个例子：```
1
6
```| 圆形| 价值| 主要的？ | 添加俯卧撑 | 总计 |
 | --- | --- | --- | --- | --- |
 | 1 | 6 | 没有 | 0 | 0 |

 数字 6 是合数，因此以利亚移动到质因数（例如 2 或 3）并获胜。 

对于第二个例子：```
2
30
2
```| 圆形| 价值| 主要的？ | 添加俯卧撑 | 总计 |
 | --- | --- | --- | --- | --- |
 | 1 | 30| 没有 | 0 | 0 |
 | 2 | 2 | 是的 | 4 | 4 |

 第一轮由伊利亚获胜。 第二轮是黄金位置，所以 Fiona 获胜，Elijah 受到处罚$2 \times 2$。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log^3(max(a))) | O(n log^3(max(a))) | 每个 Miller-Rabin 检验都使用恒定数量的模幂。 |
 | 空间| O(1) | O(1) | 处理每个数字时仅存储几个变量。 |

 只有 100 个数字和值最多$10^{11}$，确定性 Miller-Rabin 方法很容易满足时间限制。 

## 测试用例```python
import sys
import io

def is_prime(n):
    if n < 2:
        return False
    for p in [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]:
        if n == p:
            return True
        if n % p == 0:
            return False

    d = n - 1
    s = 0
    while d % 2 == 0:
        s += 1
        d //= 2

    for a in [2, 3, 5, 7, 11]:
        if a >= n:
            continue
        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        for _ in range(s - 1):
            x = x * x % n
            if x == n - 1:
                break
        else:
            return False
    return True

def solve(inp):
    data = inp.strip().split()
    n = int(data[0])
    ans = 0
    for i in range(1, n + 1):
        x = int(data[i])
        if is_prime(x):
            ans += 2 * x
    return str(ans)

assert solve("1\n6\n") == "0", "sample 1"
assert solve("2\n30\n2\n") == "4", "sample 2"

assert solve("1\n2\n") == "4", "smallest prime"
assert solve("3\n3\n5\n9\n") == "16", "multiple primes and composite"
assert solve("2\n1000000007\n100000000000\n") == "2000000014", "large values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 2`|`4`| 尽可能小的优质外壳 |
 |`3 / 3 5 9`|`16`| 素数分类与复合值混合 |
 |`2 / 1000000007 100000000000`|`2000000014`| 大数素数处理|

 ## 边缘情况

 对于素数，例如：```
1
7
```Miller-Rabin 将 7 识别为素数，因此该算法添加`2 * 7`。 这与游戏相符，因为以利亚没有安全的第一步。 

对于复合值，例如：```
1
12
```素性测试返回 false，因此答案保持不变。 这与 Elijah 移动到素因数并获胜的策略相匹配。 

对于最小输入：```
1
2
```素性测试正确地将 2 视为素数。 答案变成 4，它捕获了错误地假设所有偶数都是合数的实现。
