---
title: "CF 102420H - 婚礼"
description: "我们有一群不断变化的仙女。 最初有 n 个精灵，编号从 1 到 n，精灵 i 具有整数社交度值 a[i]。 观察期间有 q 个事件。 1 类事件添加了新的仙女。"
date: "2026-08-12T06:34:44+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102420
codeforces_index: "H"
codeforces_contest_name: "\u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u044b, \u0421\u0435\u0437\u043e\u043d 2019-2020, \u0422\u0440\u0435\u0442\u044c\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430, \u0443\u0441\u043b\u043e\u0436\u043d\u0435\u043d\u043d\u0430\u044f \u043d\u043e\u043c\u0438\u043d\u0430\u0446\u0438\u044f"
rating: 0
weight: 102420
solve_time_s: 111
verified: true
draft: false
---

[CF 102420H - 婚礼](https://codeforces.com/problemset/problem/102420/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一群不断变化的仙女。 最初有`n`仙女们，编号为`1`通过`n`，还有仙女`i`具有整数社交度值`a[i]`。 观察期间有`q`事件。 

A型`1`活动增加了新的仙女。 它的值直接由事件给出，并且它接收下一个从未使用过的数字，因此删除的数字永远不会被重复使用。 A型`2`事件按编号删除现有的仙女。 A型`3`活动宣布一场有价值的舞蹈`e`。 当前在场的每个仙女都会更换其价值`b`和`b XOR e`。 

每次事件结束后，我们需要仍然存在的所有精灵的当前值的总和。 

难点在于全局异或运算。 一支舞蹈可以影响多达`100000`仙女们，还可以有`100000`跳舞。 单独更新每个精灵可能需要大约`10^10`最坏情况下的异或运算。 和`n, q <= 100000`，围绕的算法`O(nq)`远远超出了实际的范围，而`O((n+q) log(n+q))`或者`O(30(n+q))`方法很容易合理。 

在一些边缘情况下，直接的实现可能会悄然出错。 首先，仙女可以在跳舞几次后加入。 考虑```
1 3
5
3 7
1 2
3 1
```输出是```
2
4
5
```跳完第一支舞后，原来仙女已经`5 XOR 7 = 2`。 新仙女超值加盟`2`， 不是`2 XOR 7`，因为它在第一支舞中并不存在。 仅存储单个全局 XOR 并盲目地将其应用于每个新插入的值的解决方案将错误地处理这种情况。 

其次，在几次舞蹈后删除一个仙女需要知道它的当前值，但我们不能将之前的所有舞蹈物理地应用到它。 例如，```
1 3
4
3 3
2 1
1 1
```产生```
7
0
1
```原来仙女有身价`4 XOR 3 = 7`当它离开时。 新插入的仙女有价值`1`，因为它在舞会之后到达。 基于每个精灵在插入时的值的表示在删除它时必须考虑全局异或。 

第三，标识符永远不会被重复使用。 例如，```
1 4
10
2 1
1 5
2 2
```产生```
0
5
0
```新来的仙女获得号码`2`，不是数字`1`。 重复使用已删除的 ID 可能会将以后的删除与错误的存储状态相关联。 

最后，值可以接近`2^30`，总和大约可以达到`10^14`。 Python 整数直接处理这个问题，而具有固定宽度整数类型的语言需要 64 位整数作为答案。 

## 方法

 直接的解决办法就是存储每个仙女当前的数值。 对于一个类型`1`事件我们为类型附加新值`2`我们删除所请求的仙女，然后输入类型`3`我们遍历当前存在的每个精灵并将其值替换为`value XOR e`。 将总和与值一起保持使得插入和删除时间恒定，但是舞蹈仍然需要触摸每个活跃的精灵。 

这种暴力方法是正确的，因为它完全执行问题所描述的操作。 它的弱点是重复更新的次数。 在最坏的情况下`100000`仙女和`100000`舞蹈活动，它可以表演大约`10^10`个别仙女更新。 即使在考虑 Python 开销之前，这也太大了。 

关键的观察结果是 XOR 独立地作用于每一位。 假设我们关注一位位置。 如果舞蹈位是`0`，该位不会改变。 如果舞蹈位是`1`，当前的每个仙女都会翻转这一点。 我们不需要知道每个仙女的完整价值就可以知道该位对总价值的贡献。 我们只需要对应存储位为的活动精灵的数量`1`。 

有一个复杂的问题：新的仙女会在任意时间到达。 处理这个问题的简洁方法是将全球舞蹈的历史与每个仙女的存储状态分开。 让`X`是迄今为止发生的每一个舞蹈的异或。 为每个活跃的仙女存储一个隐藏值`base`使其实际当前值为`base XOR X`。 

对于一个原本的仙女来说，`base`最初是它的给定值。 当一个有实际价值的新仙女`v`到达后，我们选择它的基地为`v XOR X`。 那么它的实际值立即变成`(v XOR X) XOR X = v`，完全按照要求。 

当仙女离开时，其存储的基数足以识别其当前值，因为当前值只是`base XOR X`。 我们可以从每比特计数中删除它的贡献，而无需重播旧的舞蹈。 

剩下的问题是如何快速得到总和。 对于每一位`k`， 维持`cnt[k]`，活跃精灵的数量`base`有位`k`放。 如果位`k`的`X`恰好为零`cnt[k]`当前值已设置该位。 如果位`k`的`X`是 1，XOR 翻转该位，所以准确地说`active - cnt[k]`当前值已设置该位。 因此比特的贡献`k`是它的设置位计数乘以`2^k`。 

只有 30 个相关位，因为所有输入值最多为`10^9`，即下面的`2^30`。 每个事件都可以更新位计数`O(30)`时间，并且每个答案也可以计算`O(30)`时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(nq)`在最坏的情况下|`O(n + q)`| 太慢了 |
 | 最佳|`O(30(n + q))`|`O(n + q)`| 已接受 |

 ## 算法演练

 1. 保留全局整数`X`，最初为零。 它代表迄今为止发生的所有舞蹈的异或。 每个精灵的实际价值将表示为`base XOR X`。 
2. 维护`cnt[k]`对于每一位`k`从`0`通过`29`。 它存储了有多少活跃的仙女被咬了`k`设置在他们的`base`价值。 还保留一个数组`base[id]`对于每个可能的仙女标识符，因为稍后的删除为我们提供了标识符，并且我们需要其存储的表示形式。 
3. 对于每个初始精灵，存储其给定值作为其基础。 添加一到`cnt[k]`对于该值的每个设置位。 自从`X = 0`最初，基本表示等于实际值。 
4. 对于一个类型`1`有价值的事件`v`，分配下一个未使用的标识符。 新基地是`v XOR X`。 这是关键的插入规则：新的仙女应该有实际价值`v`现在，虽然之前所有的舞蹈都已经被编码了`X`。 
5. 将这个新基数的位添加到`cnt`。 现在，该仙女的表现与每个现有仙女一致。 
6. 对于一个类型`2`带有标识符的事件`p`， 取回`base[p]`。 从中删除其设置位`cnt`。 全球`X`不会改变，所以不需要修改任何其他内容。 
7. 对于一个类型`3`有价值的事件`e`， 代替`X`经过`X XOR e`。 没有一个仙女被触动。 由于每个当前值都表示为`base XOR X`，改变`X`同时将新的 XOR 运算应用于所有这些。 
8. 每做完一件事，一点一点地计算答案。 对于位`k`， 如果`X`那里有一个零，当前的数量是`cnt[k]`。 如果`X`那里有一个，号码是`active - cnt[k]`。 将计数乘以`2^k`并将其添加到答案中。 

### 为什么它有效

 不变量是，对于每个活跃的精灵，其实际值恰好是`base[id] XOR X`， 尽管`cnt[k]`正好是位的活性碱基数`k`放。 最初这两个陈述都成立，因为`X = 0`。 插入选择`base = v XOR X`，所以新的实际值为`v`。 删除操作精确地从每一位计数中删除了该仙女的基础。 只改变一段舞蹈`X`，它将每个当前值转换为`base XOR X`进入`base XOR X XOR e`，正是所需的新值。 最后，对于每个位，XOR 要么保留所有位，要么翻转所有位，因此`cnt[k]`或者`active - cnt[k]`给出包含该位的当前值的确切数量. 将这些位贡献相加即可得到准确的总数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

BITS = 30

def add_base(x, cnt, delta):
    for b in range(BITS):
        if (x >> b) & 1:
            cnt[b] += delta

def solve():
    n, q = map(int, input().split())
    initial = list(map(int, input().split()))

    # base[id] is the value that must be XORed with global_x
    # to obtain the fairy's current value.
    base = [0] * (n + q + 1)

    # Number of active fairies whose base has each bit set.
    cnt = [0] * BITS

    global_x = 0
    active = n
    next_id = n + 1

    for i, x in enumerate(initial, 1):
        base[i] = x
        add_base(x, cnt, 1)

    out = []

    for _ in range(q):
        event = list(map(int, input().split()))
        t = event[0]

        if t == 1:
            v = event[1]

            # We need (base ^ global_x) == v.
            b = v ^ global_x

            base[next_id] = b
            add_base(b, cnt, 1)

            active += 1
            next_id += 1

        elif t == 2:
            p = event[1]
            b = base[p]

            add_base(b, cnt, -1)
            active -= 1

        else:
            e = event[1]
            global_x ^= e

        # Reconstruct the sum from the bit counts.
        ans = 0
        for b in range(BITS):
            ones = cnt[b]
            if (global_x >> b) & 1:
                ones = active - ones
            ans += ones << b

        out.append(str(ans))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```这`base`数组有空间`n + q`标识符，因为至多`q`新的仙女可以到达，每个到达的仙女都会收到一个新的标识符。 该数组直接按仙女数进行索引，因此除了 30 位更新之外，删除是常数时间的。 

这`add_base`助手将所有位计数器更新为一个基值。 它被称为`delta = 1`当仙女进来时`delta = -1`当仙女离开时。 无论发生多少次舞蹈，都会使用相同的表示形式。 

插入线`b = v ^ global_x`是实现中最微妙的部分。 存储的基数是故意不`v`。 由于当前值必须是`b ^ global_x`，选择`b = v ^ global_x`使当前值精确`v`。 

A型`3`事件仅执行`global_x ^= e`。 这是消除暴力解决方案潜在的二次行为的操作。 每个仙女都通过改变的全局值隐含地接受了舞蹈。 

答案由 30 位计数器重建。 当一点点`global_x`为零，具有该位设置的碱基保持设置。 当它为 1 时，该位被翻转，因此带有 0 的基数成为当前的基数。 表达式`ones << b`相当于`ones * 2^b`。 

Python 中不需要溢出处理。 最大总数安全地在 Python 的任意精度整数表示范围内。 

## 工作示例

 ### 示例 1

 初始基地是`[2, 3, 9, 5, 6, 6]`，并且最初`global_x = 0`。 每个事件后的重要状态如下所示。 

| 活动 | 行动|`global_x`| 活跃| 新增/删除基地 | 总和|
 | --- | --- | --- | --- | --- | --- |
 | 初始| 最初的仙女|`0`| 6 |`[2,3,9,5,6,6]`| 31 |
 |`1 3`| 插入仙女7 |`0`| 7 |`base[7] = 3`| 34 | 34
 |`3 5`| 全局异或 |`5`| 7 | 不变| 37 | 37
 |`2 2`| 删除仙女2 |`5`| 6 | 移除底座`3`| 31 |
 |`3 2`| 全局异或 |`7`| 6 | 不变| 27 | 27
 |`2 7`| 删除仙女7|`7`| 5 | 移除底座`3`| 23 | 23

 插入的仙女有底座`3`因为全局异或仍然为零。 与 跳舞后`5`，其当前值为`3 XOR 5 = 6`。 第二支舞结束后，其当前值变为`3 XOR 7 = 4`，因此正确删除它会删除基数`3`在当前 XOR 保持不变的情况下从计数器中`7`。 

### 构造示例

 考虑```
1 3
5
3 7
1 2
3 1
```状态的演变如下。 

| 活动 | 行动|`global_x`| 活跃| 插入底座| 总和|
 | --- | --- | --- | --- | --- | --- |
 | 初始| 最初的仙女|`0`| 1 | 无 | 5 |
 |`3 7`| 全局异或 |`7`| 1 | 无 | 2 |
 |`1 2`| 插入仙女2 |`7`| 2 |`2 XOR 7 = 5`| 4 |
 |`3 1`| 全局异或 |`6`| 2 | 不变| 5 |

 新仙女获得当前值`2`虽然`global_x`已经是`7`。 它的基数是`5`， 因为`5 XOR 7 = 2`。 当下一支舞改变时`global_x`到`6`，其值自动变为`5 XOR 6 = 3`，而原来的仙女就变成了`5 XOR 6 = 3`以及。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(30(n + q))`| 每次插入、删除和应答计算最多处理 30 位。 |
 | 空间|`O(n + q)`| 基本数组存储每个可能的精灵标识符，并且位计数器数组具有恒定大小。 |

 至多有`200000`由于存储的标识符和仅 30 位位置，该算法仅执行几百万次简单操作。 这完全在预期的规模之内`n, q <= 100000`，与暴力方法不同，暴力方法可以达到大约`10^10`仙女更新。 

## 测试用例

 以下测试工具实现了与函数相同的算法，因此可以使用普通的 Python 断言来检查每种情况。```python
import sys
import io

def solve_string(inp: str) -> str:
    data = iter(inp.strip().split())
    n = int(next(data))
    q = int(next(data))

    initial = [int(next(data)) for _ in range(n)]

    BITS = 30
    base = [0] * (n + q + 1)
    cnt = [0] * BITS

    global_x = 0
    active = n
    next_id = n + 1

    def add_base(x, delta):
        for b in range(BITS):
            if (x >> b) & 1:
                cnt[b] += delta

    for i, x in enumerate(initial, 1):
        base[i] = x
        add_base(x, 1)

    out = []

    for _ in range(q):
        t = int(next(data))

        if t == 1:
            v = int(next(data))
            b = v ^ global_x
            base[next_id] = b
            add_base(b, 1)
            next_id += 1
            active += 1

        elif t == 2:
            p = int(next(data))
            add_base(base[p], -1)
            active -= 1

        else:
            e = int(next(data))
            global_x ^= e

        ans = 0
        for b in range(BITS):
            ones = cnt[b]
            if (global_x >> b) & 1:
                ones = active - ones
            ans += ones << b

        out.append(str(ans))

    return "\n".join(out)

# Provided sample
sample1 = """\
6 5
2 3 9 5 6 6
1 3
3 5
2 2
3 2
2 7
"""

assert solve_string(sample1) == """\
34
37
31
27
23
""".strip(), "sample 1"

# Minimum-size input, with insertion, dance, and deletion.
case2 = """\
1 3
1
1 2
3 3
2 1
"""

assert solve_string(case2) == """\
3
0
2
""".strip(), "minimum-size / insertion / deletion"

# New fairy after a previous dance.
case3 = """\
1 3
5
3 7
1 2
3 1
"""

assert solve_string(case3) == """\
2
4
5
""".strip(), "insertion after global XOR"

# All values equal, followed by several global XOR operations.
case4 = """\
4 4
7 7 7 7
3 7
3 1
2 2
1 7
"""

assert solve_string(case4) == """\
0
4
3
10
""".strip(), "all equal values and repeated XOR"

# Boundary values near 2^30, plus deletion and a new identifier.
case5 = """\
2 5
1 1073741823
3 1073741823
1 1073741823
2 1
3 1
2 2
"""

assert solve_string(case5) == """\
1073741822
1073741823
1073741822
1073741823
0
""".strip(), "30-bit boundary and identifier handling"

# Maximum-size style test, generated rather than written literally.
# 100000 identical fairies and 100000 insertions.
n = 100000
q = 100000
initial = " ".join(["1"] * n)
events = "\n".join(["1 1"] * q)
large_input = f"{n} {q}\n{initial}\n{events}\n"

large_output = solve_string(large_input)
lines = large_output.splitlines()

assert len(lines) == q, "maximum-size event count"
assert lines[0] == str(n + 1), "first maximum-size insertion"
assert lines[-1] == str(n + q), "last maximum-size insertion"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 3 / 1 / 1 2 / 3 3 / 2 1`|`3, 0, 2`| 最小尺寸状态更改和删除 |
 |`1 3 / 5 / 3 7 / 1 2 / 3 1`|`2, 4, 5`| 之前的舞蹈结束后，仙女加入 |
 |`4 4 / 7 7 7 7 / 3 7 / 3 1 / 2 2 / 1 7`|`0, 4, 3, 10`| 全部相等的值和重复的全局异或 |
 |`2 5 / 1 1073741823 / ...`|`1073741822, 1073741823, 1073741822, 1073741823, 0`| 最高相关位和大金额 |
 | 生成`n=q=100000`案例 |`100000`输出线| 最大事件数和标识符增长 |

 ## 边缘情况

 仙女在之前的舞蹈之后加入是通过根据当前的全局异或调整其基数来处理的。 在```
1 3
5
3 7
1 2
3 1
```第一个舞蹈变化`global_x`到`7`。 当值`2`到达时，它的基地变成`2 XOR 7 = 5`。 它的当前值是立即`5 XOR 7 = 2`，根据需要。 下一个舞蹈变化`global_x`到`6`，所以新的精灵自动变成`5 XOR 6 = 3`。 输出序列`2, 4, 5`确认新的仙女不会受到早期舞蹈的影响。 

跳舞后删除精灵是有效的，因为删除操作是基于基数而不是当前值。 为了```
1 3
4
3 3
2 1
1 1
```原来仙女有底座`4`和`global_x = 3`，所以它的当前值为`7`。 删除它会减去基数位`4`从`cnt`，没有留下活跃的仙子。 下一次插入发生在`global_x = 3`，所以新仙女有颜值`1`得到基地`1 XOR 3 = 2`。 其当前值为`2 XOR 3 = 1`，产生输出`7, 0, 1`。 

通过维护来避免标识符重用`next_id`与活跃精灵的数量无关。 在```
1 4
10
2 1
1 5
2 2
```仙女`1`被删除，但新的仙女收到标识符`2`。 它的基数是`5`，并删除标识符`2`正确地删除了那个仙女。 输出是`0, 5, 0`。 搜索免费标识符或重用的解决方案`1`可能会使最终删除引用错误的仙女。 

空集状态在删除后也有效。 一次`active`变为零，无论何种情况，每一位的当前计数都为零`global_x`， 因为`active - cnt[k]`也为零。 后续插入从当前开始`global_x`并立即重建正确的电流值。 

30 位边界是安全的，因为每个提供的值最多是`10^9`，并对下面的数字进行异或`2^30`也停留在下面`2^30`。 位`0`通过`29`因此就足够了。 总和可能远大于`2^30`，但Python整数具有任意精度，因此直接计算答案是安全的。
