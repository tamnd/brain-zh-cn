---
title: "CF 102766C - 常规括号序列"
description: "我们得到一个仅由左括号（和右括号）组成的字符串。 我们想将其转换为常规的括号序列。"
date: "2026-07-28T23:37:08+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102766
codeforces_index: "C"
codeforces_contest_name: "Codedigger Training Contest -String"
rating: 0
weight: 102766
solve_time_s: 84
verified: true
draft: false
---

[CF 102766C - 常规括号序列](https://codeforces.com/problemset/problem/102766/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 24s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个仅由左括号组成的字符串`(`和右括号`)`。 我们想将其转换为常规的括号序列。 两种允许的操作具有不同的效果：删除字符会完全删除一个括号，而将字符移动到末尾会保留括号但会更改其位置。 

常规括号序列有两个要求。 左括号和右括号的总数必须相等，并且在从左到右读取序列时，到目前为止看到的左括号的数量永远不会小于右括号的数量。 输入包含几个独立的情况，每个情况都有字符串长度和两个操作的成本，后跟括号字符串。 输出是使每个案例有效所需的最低成本。 

所有字符串的总长度最多为$10^5$，因此解必须接近线性。 二次解已经太慢了，因为长度的字符串$10^5$会围绕创造$10^{10}$要检查的位置对。 较大的成本值还意味着实现必须使用 64 位整数，因为答案可能超出 32 位整数的范围。 

有少数情况很容易处理不当。 如果字符串已经有效，则答案为零。 

例如：```
Input:
4 5 10
()()
```正确的输出是：```
0
```始终执行某些操作来“修复”字符串的解决方案在这里会失败。 

另一个重要的情况是字符串的括号类型数量错误。```
Input:
5 100 1
)))))
```正确的输出是：```
5000000000
```有五个额外的右括号。 移动它们不会改变计数，因此唯一可能的解决方案是删除所有五个。 仅计算排序问题的粗心解决方案可能会错误地返回小得多的值。 

当移动比删除更便宜时，就会出现第三种棘手的情况。```
Input:
2 100 1
)(
```正确的输出是：```
1
```该序列具有正确的每个括号的编号，但顺序无效。 删除的成本比移动第一个要高得多`)`到最后。 

## 方法

 直接的暴力方法将尝试移动所有可能的字符集并删除所有可能的字符集，然后检查剩余的序列是否规则。 这是正确的，因为每个可能的操作序列都被表示出来，但这是完全不切实际的。 甚至决定移动哪些角色已经给出了$2^n$可能性，并且检查每种可能性是不可能的$n=10^5$。 

关键的观察结果来自于比较两种运营成本。 如果删除并不比移动更昂贵，那么就没有理由移动括号。 移动仅改变支架的位置，并且成本至少与移除支架的成本相同。 最便宜的策略就是简单地删除阻止序列变得规则的括号。 

当搬家更便宜时，只要问题仅与订购有关，我们就应该使用搬家。 然而，移动不能改变左括号和右括号的数量，因此两个计数之间的任何差异仍然必须通过删除来消除。 

在进行必要的删除之后，剩余的字符串的两个括号的数量相等。 对于这样的字符串，所需的最小移动次数恰好是从左到右扫描时遇到的不匹配的右括号的数量。 每个这样的右括号都会创建一个前缀，其中余额变为负数，并将这些右括号移到末尾可修复前缀顺序。 不能少的移动可以起作用，因为每个负点都需要从前缀中删除一个有问题的右括号。 

剩下的问题是，当搬家更便宜时，应该删除哪些括号。 如果左括号太多，最好删除末尾附近的左括号，因为它影响的前缀最少。 如果右括号太多，最好删除开头附近的右括号，因为这样可以尽可能增加后面的余额。 这些选择留下了最大可能的平衡并最小化了所需的移动次数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了|
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 计算左括号和右括号的数量。 如果删除比移动更便宜或等于移动，则直接计算不匹配的左括号和右括号。 答案是删除次数乘以删除成本。 
2.如果搬家比较便宜，首先去掉不可避免的多余支架。 如果有更多左括号，请从末端移除多余的左括号。 如果有更多右括号，请从开头删除多余的右括号。 这留下了最大可能的前缀余额。 
3. 扫描剩余序列并保持运行平衡`(`加一并且`)`减一。 每当余额变为负数时，就必须将一个右括号移至末尾。 数一数这种情况发生了多少次。 
4. 将移动次数乘以移动成本，并加上第一步的删除成本。 

为什么它有效：在进行所需的删除之后，剩余的字符串具有相同数量的左括号和右括号。 仅当某些前缀包含太多右括号时，常规括号序列才会失败。 将这些额外的右括号精确移到末尾会删除所有此类违规，并且每个违规对应于必须保留前缀的不同右括号。 删除选择保留最大可能的前缀余额，因此可以最大限度地减少随后所需的移动次数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case(n, a, b, s):
    opens = s.count('(')
    closes = n - opens

    if a <= b:
        balance = 0
        bad_close = 0
        for c in s:
            if c == '(':
                balance += 1
            else:
                balance -= 1
                if balance < 0:
                    bad_close += 1
                    balance = 0
        bad_open = balance
        return (bad_close + bad_open) * a

    if opens > closes:
        extra = opens - closes
        removed = 0
        chars = []
        for c in reversed(s):
            if c == '(' and removed < extra:
                removed += 1
            else:
                chars.append(c)
        chars.reverse()
        s = ''.join(chars)

        balance = 0
        moves = 0
        for c in s:
            if c == '(':
                balance += 1
            else:
                balance -= 1
                if balance < 0:
                    moves += 1
                    balance = 0

        return extra * a + moves * b

    if closes > opens:
        extra = closes - opens
        removed = 0
        chars = []
        for c in s:
            if c == ')' and removed < extra:
                removed += 1
            else:
                chars.append(c)
        s = ''.join(chars)

        balance = 0
        moves = 0
        for c in s:
            if c == '(':
                balance += 1
            else:
                balance -= 1
                if balance < 0:
                    moves += 1
                    balance = 0

        return extra * a + moves * b

    balance = 0
    moves = 0
    for c in s:
        if c == '(':
            balance += 1
        else:
            balance -= 1
            if balance < 0:
                moves += 1
                balance = 0

    return moves * b

def main():
    t = int(input())
    ans = []
    for _ in range(t):
        n, a, b = map(int, input().split())
        s = input().strip()
        ans.append(str(solve_case(n, a, b, s)))
    print('\n'.join(ans))

if __name__ == "__main__":
    main()
```第一个分支处理删除占主导地位的情况。 扫描会计算在足够的左括号存在之前出现的右括号，扫描后的剩余余额恰好是不匹配的左括号的数量。 

当移动成本较低时，代码首先仅删除不可避免的多余括号。 移除的方向很重要。 多余的左括号从右侧删除，因为提前删除它们会降低许多前缀余额。 多余的右括号从左侧删除，因为这些括号对前缀的伤害最大。 

最终扫描计算所需的移动次数。 发现负值后，余额将重置为零，因为不匹配的右括号将被移走。 费用可以达到$5 \times 10^{13}$，因此 Python 整数自然可以处理所需的范围。 

## 工作示例

 ### 示例 1

 输入：```
2 100 1
)(
```移动操作更便宜。 

| 人物 | 平衡| 移动 |
 | ---| ---| ---|
 |`)`| -1 变为 0 | 1 |
 |`(`| 1 | 1 |

 该字符串具有相等的计数，因此不需要删除。 将一个右括号移至末尾，产生`()`。 

结果是：```
1
```这表明，当排序问题比删除更便宜时，应该通过移动来解决排序问题。 

### 示例 2

 输入：```
3 1000 1
()(
```有一个额外的开口支架。 

| 人物 | 行动| 剩余余额 |
 | ---| ---| ---|
 |`(`| 保持| 1 |
 |`)`| 保持| 0 |
 |`(`| 删除作为剩余 | 0 |

 多余的开口支架从末端移除。 无需任何动作。 

结果是：```
1000
```这说明了为什么应从右侧删除多余的左括号。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个括号仅被扫描固定次数。 |
 | 空间| O(n) | 该实现存储删除后过滤后的字符串。 |

 所有字符串长度之和最多为$10^5$，因此线性解决方案很容易满足时间限制和内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    t = int(input())
    res = []
    for _ in range(t):
        n, a, b = map(int, input().split())
        s = input().strip()
        res.append(str(solve_case(n, a, b, s)))
    sys.stdin = old_stdin
    return "\n".join(res)

def solve_case(n, a, b, s):
    opens = s.count('(')
    closes = n - opens

    if a <= b:
        bal = bad = 0
        for c in s:
            if c == '(':
                bal += 1
            else:
                bal -= 1
                if bal < 0:
                    bad += 1
                    bal = 0
        return (bad + bal) * a

    if opens > closes:
        extra = opens - closes
        rem = 0
        arr = []
        for c in reversed(s):
            if c == '(' and rem < extra:
                rem += 1
            else:
                arr.append(c)
        s = ''.join(reversed(arr))
        ans = extra * a
    elif closes > opens:
        extra = closes - opens
        rem = 0
        arr = []
        for c in s:
            if c == ')' and rem < extra:
                rem += 1
            else:
                arr.append(c)
        s = ''.join(arr)
        ans = extra * a
    else:
        ans = 0

    bal = moves = 0
    for c in s:
        if c == '(':
            bal += 1
        else:
            bal -= 1
            if bal < 0:
                moves += 1
                bal = 0

    return ans + moves * b

assert run("""5
2 100 1
)(
2 1 100
)(
3 1 1000
)()
3 1000 1
()(
5 1000000000 1
)))))
""") == """1
2
1
1000
5000000000"""

assert run("""1
1 5 2
(
""") == "5"

assert run("""1
6 10 1
))((()
""") == "2"

assert run("""1
4 7 3
()()
""") == "0"

assert run("""1
5 1 2
)))))
""") == "5"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 1 5 2 / (`|`5`| 最小尺寸和无与伦比的开口支架处理 |
 |`1 / 6 10 1 / ))((()`|`2`| 移动错位的右括号 |
 |`1 / 4 7 3 / ()()`|`0`| 已经有效的序列 |
 |`1 / 5 1 2 / )))))`|`5`| 大删减要求|

 ## 边缘情况

 对于`)(`对于廉价的移动，算法会保留两个括号，因为计数已经相等。 扫描发现第一个`)`产生负余额，因此计算一次移动。 将括号移到最后后，结果是`()`，给出最小成本。 

为了`()(`对于便宜的棋步，左括号比右括号多。 该算法删除了最终的`(`因为这是危害最小的删除。 剩余的字符串已经是规则的，因此唯一的成本就是删除。 

为了`)))))`，任何运动都无济于事，因为运动永远不会改变右括号的数量。 该算法进入删除路径并删除所有五个字符，产生空的常规括号序列。 返回的成本为$5 \times 10^9$，它与所需的 64 位范围处理相匹配。
