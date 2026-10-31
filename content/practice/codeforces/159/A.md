---
title: "CF 159A - 朋友与否"
description: "我们获得了社交网络中用户之间的私人消息的时间顺序日志。 每条记录包含消息的发送者、接收者和时间戳。 如果两个用户中的一个足够快地回复对方的消息，那么他们就会成为朋友。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "*special", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 159
codeforces_index: "A"
codeforces_contest_name: "VK Cup 2012 Qualification Round 2"
rating: 1400
weight: 159
solve_time_s: 107
verified: true
draft: false
---

[CF 159A - 朋友与否](https://codeforces.com/problemset/problem/159/A)

 **评分：** 1400
 **标签：** *特殊、贪婪、实现
 **求解时间：** 1m 47s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们获得了社交网络中用户之间的私人消息的时间顺序日志。 每条记录包含消息的发送者、接收者和时间戳。 

如果两个用户中的一个足够快地回复对方的消息，那么他们就会成为朋友。 更准确地说，假设用户`A`向用户发送消息`B`在某个时间`t1`，以及后来的用户`B`向用户发送消息`A`在某个时间`t2`。 如果`0 < t2 - t1 <= d`，那么第二条消息算作对第一条消息的回复。 一旦两个用户之间至少存在一个这样的回复，他们就被视为朋友。 

任务是找到可以从消息历史记录中形成的每对友谊对。 

输入尺寸很小。 消息条数最多为`1000`，所以即使是一个`O(n^2)`解决方案最多执行一百万对检查，在 3 秒的时间限制内是完全安全的。 不需要高级的数据结构或优化技巧。 

主要挑战是正确处理回复条件。 消息已按时间排序，但时间戳可能相同，并且只有严格晚于的消息才能算作回复。 差值为零是无效的。 

一个容易犯的错误就是忘记回复的方向。 

考虑这个输入：```
2 5
alice bob 1
alice bob 3
```正确输出：```
0
```两条消息均来自`alice`到`bob`。 回复需要反转方向。 

另一个微妙的情况是时间上的严格不平等。```
2 5
alice bob 10
bob alice 10
```正确输出：```
0
```时间戳是相等的，所以`t2 - t1 = 0`，这不满足`0 < t2 - t1`。 

第三个陷阱是打印重复的友谊对。```
4 10
alice bob 1
bob alice 2
alice bob 3
bob alice 4
```正确输出：```
1
alice bob
```即使存在多个有效回复，该对也必须恰好出现一次。 

## 方法

 暴力方法检查每对有序消息。 

假设消息`i`是：```
A -> B at time t1
```和留言`j`是：```
B -> A at time t2
```如果`i < j`和`0 < t2 - t1 <= d`，那么第二条消息就是一个有效的回复，所以`A`和`B`成为朋友。 

此方法是正确的，因为友谊定义仅取决于消息对。 通过检查每个可能的对，我们不会错过任何有效的交互。 

最坏情况的表现约为`1000 × 1000 = 1,000,000`比较，这很容易足够快。 

关键的观察结果是，约束足够小，暴力思想在实践中已经是最佳的。 没有理由使用滑动窗口或基于哈希的时间戳跟踪来使解决方案变得复杂。 

唯一的额外细节是如何存储不重复的友谊对。 由于友谊是对称的，`(alice, bob)`和`(bob, alice)`代表同样的关系。 在将它们插入集合之前，我们可以通过按字母顺序对两个名称进行排序来标准化每对。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(k) | 已接受 |
 | 最佳| O(n²) | O(k) | 已接受 |

 这里，`k`是友谊对的数量。 

## 算法演练

 1. 将所有消息读入数组。 
2. 创建一个空集，名为`friends`。 

该集合会自动删除重复的好友对。 
3. 迭代每对消息`(i, j)`这样`j > i`。 

由于日志是按时间顺序排列的，因此消息`j`永远不会早于消息`i`。 
4.留言`i`是`(a1, b1, t1)`和留言`j`是`(a2, b2, t2)`。 
5. 检查方向是否装反。 

我们需要：```
a1 == b2
b1 == a2
```这意味着第二条消息将返回到原始发件人。 
6. 检查时间差是否满足：```
0 < t2 - t1 <= d
```差异必须严格为正，因为回复不可能在同一时刻发生。 
7. 如果两个条件都成立，则将标准化对插入集合中。 

我们存储：```
tuple(sorted([a1, b1]))
```这样两个方向都映射到相同的友谊。 
8. 处理完所有对后，打印集合和每个友谊对的大小。 

### 为什么它有效

 该算法检查每个可能的早先-晚消息对。 当且仅当至少有一对满足回复条件时，友谊才存在。 由于没有跳过任何对，因此会发现每个有效的友谊。 

规范化步骤保证了无论消息方向如何，相同的友谊都被唯一地表示。 由于结果存储在一个集合中，因此同一用户之间重复的有效回复不能创建重复的输出行。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, d = map(int, input().split())

    messages = []

    for _ in range(n):
        a, b, t = input().split()
        messages.append((a, b, int(t)))

    friends = set()

    for i in range(n):
        a1, b1, t1 = messages[i]

        for j in range(i + 1, n):
            a2, b2, t2 = messages[j]

            if a1 == b2 and b1 == a2:
                diff = t2 - t1

                if 0 < diff <= d:
                    friends.add(tuple(sorted((a1, b1))))

    print(len(friends))

    for a, b in friends:
        print(a, b)

solve()
```该解决方案首先将所有消息存储在列表中，因为每条消息可能需要与后面的每条消息进行比较。 

嵌套循环自动强制执行时间顺序。 自从`j > i`，第二条消息永远不会早于第一条消息。 

方向检查是实施过程中最重要的部分。 我们只接受发送者和接收者交换位置的消息。 同一方向的两条消息不能形成回复对。 

时间条件使用严格正数：```
0 < diff <= d
```使用`diff >= 0`会错误地接受同时发送的消息。 

友谊对在插入集合之前被标准化。 无需排序，两者`(alice, bob)`和`(bob, alice)`可能会根据首先找到的回复单独出现。 

## 工作示例

 ### 示例 1

 输入：```
4 1
vasya petya 1
petya vasya 2
anya ivan 2
ivan anya 4
```追踪：

 | 我| j | 留言我 | 留言 反方向？ | 时差 | 已添加友谊 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 1 | 瓦西亚→佩蒂亚@1 | 彼佳→瓦西亚@2 | 是的 | 1 | （佩蒂亚，瓦西亚）|
 | 0 | 2 | 瓦西亚→佩蒂亚@1 | 安雅→伊万@2 | 没有 | - | 没有 |
 | 0 | 3 | 瓦西亚→佩蒂亚@1 | 伊万→安雅@4 | 没有 | - | 没有 |
 | 1 | 2 | 彼佳→瓦西亚@2 | 安雅→伊万@2 | 没有 | - | 没有 |
 | 1 | 3 | 彼佳→瓦西亚@2 | 伊万→安雅@4 | 没有 | - | 没有 |
 | 2 | 3 | 安雅→伊万@2 | 伊万→安雅@4 | 是的 | 2 | 没有 |

 第一对形成有效回复，因为方向相反，并且差异正好`d`。 第二个候选人失败了，因为延迟太大。 

### 示例 2

 输入：```
4 10
alice bob 1
bob alice 2
alice bob 3
bob alice 4
```追踪：

 | 我| j | 留言我 | 留言 反方向？ | 时差 | 已添加友谊 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 1 | 爱丽丝→鲍勃@1 | 鲍勃→爱丽丝@2 | 是的 | 1 | （爱丽丝，鲍勃）|
 | 0 | 2 | 爱丽丝→鲍勃@1 | 爱丽丝→鲍勃@3 | 没有 | - | 没有 |
 | 0 | 3 | 爱丽丝→鲍勃@1 | 鲍勃→爱丽丝@4 | 是的 | 3 | 已经存在 |
 | 1 | 2 | 鲍勃→爱丽丝@2 | 爱丽丝→鲍勃@3 | 是的 | 1 | 已经存在 |
 | 1 | 3 | 鲍勃→爱丽丝@2 | 鲍勃→爱丽丝@4 | 没有 | - | 没有 |
 | 2 | 3 | 爱丽丝→鲍勃@3 | 鲍勃→爱丽丝@4 | 是的 | 1 | 已经存在 |

 该跟踪显示了为什么需要一组。 存在多个有效回复对，但输出中只能出现一个友谊。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n²) | 每对消息都会检查一次 |
 | 空间| O(k) | 友谊最多`k`独特的配对|

 和`n ≤ 1000`，二次扫描在最坏的情况下执行大约一百万次比较，这对于给定限制内的 Python 来说是微不足道的。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def solve():
        n, d = map(int, input().split())

        messages = []

        for _ in range(n):
            a, b, t = input().split()
            messages.append((a, b, int(t)))

        friends = set()

        for i in range(n):
            a1, b1, t1 = messages[i]

            for j in range(i + 1, n):
                a2, b2, t2 = messages[j]

                if a1 == b2 and b1 == a2:
                    diff = t2 - t1

                    if 0 < diff <= d:
                        friends.add(tuple(sorted((a1, b1))))

        out = [str(len(friends))]

        for a, b in sorted(friends):
            out.append(f"{a} {b}")

        return "\n".join(out)

    return solve()

# provided sample
assert run(
    "4 1\n"
    "vasya petya 1\n"
    "petya vasya 2\n"
    "anya ivan 2\n"
    "ivan anya 4\n"
) == (
    "1\n"
    "petya vasya"
), "sample 1"

# minimum-size input
assert run(
    "1 5\n"
    "alice bob 1\n"
) == (
    "0"
), "single message cannot form friendship"

# equal timestamps should not count
assert run(
    "2 5\n"
    "alice bob 10\n"
    "bob alice 10\n"
) == (
    "0"
), "difference must be strictly positive"

# multiple replies but only one friendship
assert run(
    "4 10\n"
    "alice bob 1\n"
    "bob alice 2\n"
    "alice bob 3\n"
    "bob alice 4\n"
) == (
    "1\n"
    "alice bob"
), "duplicate friendships must be removed"

# boundary condition diff == d
assert run(
    "2 3\n"
    "a b 5\n"
    "b a 8\n"
) == (
    "1\n"
    "a b"
), "difference equal to d is valid"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单条留言| 0 条友谊 | 最小尺寸行为 |
 | 相等的时间戳| 0 条友谊 | 严格的不平等`t2 > t1`|
 | 多个有效回复 | 仅有一份友谊 | 重复删除 |
 | 差异完全`d`| 友谊存在 | 包含上限 |

 ## 边缘情况

 考虑并发消息：```
2 5
alice bob 10
bob alice 10
```该算法比较两个消息并计算：```
diff = 10 - 10 = 0
```由于条件是`0 < diff <= d`，该对被正确拒绝。 粗心的实现使用`diff >= 0`会错误地将他们标记为朋友。 

现在考虑重复的对话：```
4 10
alice bob 1
bob alice 2
alice bob 3
bob alice 4
```该算法多次发现友谊，但每次插入都使用：```
tuple(sorted((a1, b1)))
```它总是产生：```
(alice, bob)
```由于结果存储在一个集合中，重复项会自动消失。 

最后，仅考虑一个方向的消息：```
3 10
alice bob 1
alice bob 2
alice bob 3
```每次比较都无法通过反向检查：```
a1 == b2 and b1 == a2
```所以没有添加友谊。 输出正确：```
0
```
